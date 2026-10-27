import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import fs from 'fs';
import { db, User, Post, ReactionType } from './server/data.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // Helper to format post with author and user-specific state
  const formatPost = (post: Post, currentUserId: string) => {
    const author = db.getUserById(post.authorId);
    const comments = db.getCommentsByPost(post.id).map(c => {
      const commentAuthor = db.getUserById(c.authorId);
      return {
        ...c,
        author: commentAuthor ? {
          id: commentAuthor.id,
          username: commentAuthor.username,
          name: commentAuthor.name,
          avatar: commentAuthor.avatar,
          headline: commentAuthor.headline,
        } : { id: c.authorId, username: 'unknown', name: 'Unknown', avatar: '', headline: '' },
        isLiked: c.likes.includes(currentUserId),
        likeCount: c.likes.length,
      };
    });

    const userReaction = post.reactions.find(r => r.userId === currentUserId)?.type || null;

    // Counts by reaction type
    const reactionCounts: Record<ReactionType, number> = {
      like: post.reactions.filter(r => r.type === 'like').length,
      celebrate: post.reactions.filter(r => r.type === 'celebrate').length,
      support: post.reactions.filter(r => r.type === 'support').length,
      love: post.reactions.filter(r => r.type === 'love').length,
      insightful: post.reactions.filter(r => r.type === 'insightful').length,
    };

    return {
      ...post,
      author: author ? {
        id: author.id,
        username: author.username,
        name: author.name,
        avatar: author.avatar,
        headline: author.headline,
        company: author.company,
      } : { id: post.authorId, username: 'unknown', name: 'Unknown User', avatar: '', headline: '', company: '' },
      reactionCounts,
      totalReactions: post.reactions.length,
      likeCount: post.reactions.length,
      userReaction,
      isLiked: !!userReaction,
      commentCount: comments.length,
      repostCount: post.reposts.length,
      isReposted: post.reposts.includes(currentUserId),
      isBookmarked: post.bookmarks.includes(currentUserId),
      comments,
    };
  };

  // Helper to format user with follower and connection status
  const formatUser = (user: User, currentUserId: string) => {
    return {
      ...user,
      connectionCount: user.connections.length,
      followerCount: user.followers.length,
      followingCount: user.following.length,
      isConnected: user.connections.includes(currentUserId),
      isFollowing: user.followers.includes(currentUserId),
      isSelf: user.id === currentUserId,
    };
  };

  // --- RESTful API Routes ---

  // Health check and statistics
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      backend: 'Express.js',
      timestamp: new Date().toISOString(),
      activeUserId: db.getCurrentUserId(),
      stats: db.getStats(),
    });
  });

  // Current session
  app.get('/api/session', (req: Request, res: Response) => {
    const currentUserId = db.getCurrentUserId();
    const currentUser = db.getCurrentUser();
    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({
      currentUserId,
      currentUser: formatUser(currentUser, currentUserId),
    });
  });

  // Switch session user
  app.post('/api/session/switch', (req: Request, res: Response) => {
    const { userId } = req.body;
    if (!userId || !db.setCurrentUserId(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    const currentUserId = db.getCurrentUserId();
    const currentUser = db.getCurrentUser()!;
    res.json({
      message: 'Active user switched',
      currentUserId,
      currentUser: formatUser(currentUser, currentUserId),
    });
  });

  // List all users
  app.get('/api/users', (req: Request, res: Response) => {
    const currentUserId = db.getCurrentUserId();
    const q = ((req.query.q as string) || '').trim().toLowerCase();
    let users = db.getUsers();

    if (q) {
      users = users.filter(u =>
        u.name.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        u.headline.toLowerCase().includes(q) ||
        u.bio.toLowerCase().includes(q) ||
        u.skills.some(s => s.toLowerCase().includes(q))
      );
    }

    res.json(users.map(u => formatUser(u, currentUserId)));
  });

  // Register / create new user
  app.post('/api/users', (req: Request, res: Response) => {
    const { username, name, headline, bio, avatar, company, education, location, website } = req.body;
    if (!username || !name) {
      return res.status(400).json({ error: 'Username and Name are required' });
    }

    const cleanUsername = username.trim().toLowerCase().replace(/^@/, '');
    if (db.getUsers().some(u => u.username.toLowerCase() === cleanUsername)) {
      return res.status(409).json({ error: 'Username is already taken' });
    }

    const newUser = db.createUser({
      username: cleanUsername,
      name: name.trim(),
      headline: headline ? headline.trim() : 'Software Engineer | Tech Enthusiast',
      bio: bio ? bio.trim() : 'Connecting on LinkedIn Clone.',
      avatar: avatar ? avatar.trim() : undefined,
      company: company ? company.trim() : 'CodeAlpha',
      education: education ? education.trim() : 'Computer Science',
      location: location ? location.trim() : 'Remote',
      website: website ? website.trim() : '',
    });

    db.setCurrentUserId(newUser.id);
    const currentUserId = db.getCurrentUserId();

    res.status(201).json(formatUser(newUser, currentUserId));
  });

  // Get user profile by ID
  app.get('/api/users/:id', (req: Request, res: Response) => {
    const currentUserId = db.getCurrentUserId();
    const user = db.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userPosts = db.getPosts()
      .filter(p => p.authorId === user.id)
      .map(p => formatPost(p, currentUserId));

    const connectionsList = user.connections.map(id => {
      const u = db.getUserById(id);
      return u ? formatUser(u, currentUserId) : null;
    }).filter(Boolean);

    const followersList = user.followers.map(id => {
      const f = db.getUserById(id);
      return f ? formatUser(f, currentUserId) : null;
    }).filter(Boolean);

    const followingList = user.following.map(id => {
      const f = db.getUserById(id);
      return f ? formatUser(f, currentUserId) : null;
    }).filter(Boolean);

    res.json({
      profile: formatUser(user, currentUserId),
      posts: userPosts,
      connections: connectionsList,
      followers: followersList,
      following: followingList,
    });
  });

  // Update user profile
  app.put('/api/users/:id', (req: Request, res: Response) => {
    const currentUserId = db.getCurrentUserId();
    if (req.params.id !== currentUserId) {
      return res.status(403).json({ error: 'You can only update your own profile' });
    }

    const { name, headline, bio, location, website, avatar, bannerUrl, company, education, skills } = req.body;
    const updated = db.updateUser(req.params.id, {
      ...(name && { name: name.trim() }),
      ...(headline && { headline: headline.trim() }),
      ...(bio !== undefined && { bio: bio.trim() }),
      ...(location !== undefined && { location: location.trim() }),
      ...(website !== undefined && { website: website.trim() }),
      ...(avatar !== undefined && { avatar: avatar.trim() }),
      ...(bannerUrl !== undefined && { bannerUrl: bannerUrl.trim() }),
      ...(company !== undefined && { company: company.trim() }),
      ...(education !== undefined && { education: education.trim() }),
      ...(skills && Array.isArray(skills) && { skills }),
    });

    if (!updated) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(formatUser(updated, currentUserId));
  });

  // Toggle follow/unfollow
  app.post('/api/users/:id/follow', (req: Request, res: Response) => {
    const currentUserId = db.getCurrentUserId();
    const targetUserId = req.params.id;

    if (currentUserId === targetUserId) {
      return res.status(400).json({ error: 'Cannot follow yourself' });
    }

    const result = db.toggleFollow(currentUserId, targetUserId);
    if (!result) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      isFollowing: result.isFollowing,
      targetUser: formatUser(result.targetUser, currentUserId),
      currentUser: formatUser(result.follower, currentUserId),
    });
  });

  // Toggle Connect (mutual 1st degree connection)
  app.post('/api/users/:id/connect', (req: Request, res: Response) => {
    const currentUserId = db.getCurrentUserId();
    const targetUserId = req.params.id;

    if (currentUserId === targetUserId) {
      return res.status(400).json({ error: 'Cannot connect with yourself' });
    }

    const result = db.toggleConnect(currentUserId, targetUserId);
    if (!result) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      isConnected: result.isConnected,
      targetUser: formatUser(result.userB, currentUserId),
      currentUser: formatUser(result.userA, currentUserId),
    });
  });

  // List posts (supports feeds: 'all', 'following', 'bookmarks', 'user'; search and hashtag filter)
  app.get('/api/posts', (req: Request, res: Response) => {
    const currentUserId = db.getCurrentUserId();
    const currentUser = db.getCurrentUser();
    const feed = (req.query.feed as string) || 'all';
    const tag = ((req.query.tag as string) || '').trim().toLowerCase().replace(/^#/, '');
    const q = ((req.query.q as string) || '').trim().toLowerCase();
    const userId = req.query.userId as string;

    let posts = db.getPosts();

    if (feed === 'following' && currentUser) {
      posts = posts.filter(p => currentUser.following.includes(p.authorId) || currentUser.connections.includes(p.authorId) || p.authorId === currentUserId);
    } else if (feed === 'bookmarks') {
      posts = posts.filter(p => p.bookmarks.includes(currentUserId));
    } else if (feed === 'user' && userId) {
      posts = posts.filter(p => p.authorId === userId);
    }

    if (tag) {
      posts = posts.filter(p => p.tags.map(t => t.toLowerCase()).includes(tag));
    }

    if (q) {
      posts = posts.filter(p => {
        const author = db.getUserById(p.authorId);
        const matchesContent = p.content.toLowerCase().includes(q);
        const matchesTags = p.tags.some(t => t.toLowerCase().includes(q));
        const matchesAuthor = author && (
          author.name.toLowerCase().includes(q) ||
          author.username.toLowerCase().includes(q) ||
          author.headline.toLowerCase().includes(q)
        );
        return matchesContent || matchesTags || matchesAuthor;
      });
    }

    const formatted = posts.map(p => formatPost(p, currentUserId));
    res.json(formatted);
  });

  // Create post
  app.post('/api/posts', (req: Request, res: Response) => {
    const currentUserId = db.getCurrentUserId();
    const { content, mediaUrl, tags } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Post content cannot be empty' });
    }

    let postTags: string[] = Array.isArray(tags) ? tags : [];
    const hashtagMatches = content.match(/#[a-zA-Z0-9_]+/g);
    if (hashtagMatches) {
      const extracted = hashtagMatches.map((t: string) => t.substring(1));
      postTags = Array.from(new Set([...postTags, ...extracted]));
    }

    const newPost = db.createPost(currentUserId, content.trim(), mediaUrl, postTags);
    res.status(201).json(formatPost(newPost, currentUserId));
  });

  // Delete post
  app.delete('/api/posts/:id', (req: Request, res: Response) => {
    const currentUserId = db.getCurrentUserId();
    const success = db.deletePost(req.params.id, currentUserId);
    if (!success) {
      return res.status(403).json({ error: 'Post not found or unauthorized' });
    }
    res.json({ message: 'Post deleted successfully', postId: req.params.id });
  });

  // Toggle reaction with reaction type (like, celebrate, support, love, insightful)
  app.post('/api/posts/:id/react', (req: Request, res: Response) => {
    const currentUserId = db.getCurrentUserId();
    const type: ReactionType = (req.body.type as ReactionType) || 'like';
    const result = db.toggleReaction(req.params.id, currentUserId, type);
    if (!result) {
      return res.status(404).json({ error: 'Post not found' });
    }
    const post = db.getPostById(req.params.id)!;
    res.json(formatPost(post, currentUserId));
  });

  // Legacy like endpoint
  app.post('/api/posts/:id/like', (req: Request, res: Response) => {
    const currentUserId = db.getCurrentUserId();
    const result = db.toggleReaction(req.params.id, currentUserId, 'like');
    if (!result) {
      return res.status(404).json({ error: 'Post not found' });
    }
    const post = db.getPostById(req.params.id)!;
    res.json(formatPost(post, currentUserId));
  });

  // Toggle repost
  app.post('/api/posts/:id/repost', (req: Request, res: Response) => {
    const currentUserId = db.getCurrentUserId();
    const result = db.toggleRepost(req.params.id, currentUserId);
    if (!result) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(result);
  });

  // Toggle bookmark post
  app.post('/api/posts/:id/bookmark', (req: Request, res: Response) => {
    const currentUserId = db.getCurrentUserId();
    const result = db.toggleBookmarkPost(req.params.id, currentUserId);
    if (!result) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(result);
  });

  // Get comments
  app.get('/api/posts/:id/comments', (req: Request, res: Response) => {
    const currentUserId = db.getCurrentUserId();
    const post = db.getPostById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    const comments = db.getCommentsByPost(post.id).map(c => {
      const author = db.getUserById(c.authorId);
      return {
        ...c,
        author: author ? {
          id: author.id,
          username: author.username,
          name: author.name,
          avatar: author.avatar,
          headline: author.headline,
        } : { id: c.authorId, username: 'unknown', name: 'Unknown', avatar: '', headline: '' },
        isLiked: c.likes.includes(currentUserId),
        likeCount: c.likes.length,
      };
    });
    res.json(comments);
  });

  // Add comment
  app.post('/api/posts/:id/comments', (req: Request, res: Response) => {
    const currentUserId = db.getCurrentUserId();
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Comment content cannot be empty' });
    }

    const comment = db.addComment(req.params.id, currentUserId, content.trim());
    if (!comment) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const author = db.getUserById(currentUserId);
    res.status(201).json({
      ...comment,
      author: author ? {
        id: author.id,
        username: author.username,
        name: author.name,
        avatar: author.avatar,
        headline: author.headline,
      } : { id: currentUserId, username: 'unknown', name: 'Unknown', avatar: '', headline: '' },
      isLiked: false,
      likeCount: 0,
    });
  });

  // Delete comment
  app.delete('/api/comments/:id', (req: Request, res: Response) => {
    const currentUserId = db.getCurrentUserId();
    const success = db.deleteComment(req.params.id, currentUserId);
    if (!success) {
      return res.status(403).json({ error: 'Unauthorized or comment not found' });
    }
    res.json({ message: 'Comment deleted successfully', commentId: req.params.id });
  });

  // Get job listings
  app.get('/api/jobs', (req: Request, res: Response) => {
    res.json(db.getJobs());
  });

  // Apply to job
  app.post('/api/jobs/:id/apply', (req: Request, res: Response) => {
    const job = db.getJobs().find(j => j.id === req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    job.applicants += 1;
    res.json({ message: 'Application submitted successfully', job });
  });

  // Reset database demo
  app.post('/api/reset-demo', (req: Request, res: Response) => {
    db.reset();
    res.json({ message: 'Demo database reset to initial state' });
  });

  // Generate & Download ZIP file endpoint for submission
  app.get('/api/download-zip', (req: Request, res: Response) => {
    try {
      const zipPath = path.resolve(__dirname, 'CodeAlpha_Task2_SocialMediaPlatform.zip');
      // Run the zip generator to ensure the file is completely up-to-date
      execSync(`python3 "${path.resolve(__dirname, 'scripts', 'make_zip.py')}" "${zipPath}"`, {
        cwd: __dirname,
      });

      if (!fs.existsSync(zipPath)) {
        return res.status(500).json({ error: 'Failed to generate zip file' });
      }

      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename="CodeAlpha_Task2_SocialMediaPlatform.zip"');
      const fileStream = fs.createReadStream(zipPath);
      fileStream.pipe(res);
    } catch (err: any) {
      console.error('ZIP generation error:', err);
      res.status(500).json({ error: 'Error generating zip file: ' + err.message });
    }
  });

  // Frontend mounting: Vite dev middleware or direct index.html serving
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      if (req.path.startsWith('/api')) return res.status(404).json({ error: 'Not found' });
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    try {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } catch (e) {
      console.warn('Vite middleware warning, serving static files:', e);
    }

    app.use(express.static(__dirname));
    app.get('*', (req: Request, res: Response) => {
      if (req.path.startsWith('/api')) return res.status(404).json({ error: 'Not found' });
      res.sendFile(path.resolve(__dirname, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Pulse LinkedIn Server] Express.js server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('[Pulse Server] Fatal initialization error:', err);
  process.exit(1);
});
