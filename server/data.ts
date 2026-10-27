export interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  period: string;
  description: string;
}

export interface EducationItem {
  id: string;
  school: string;
  degree: string;
  period: string;
}

export interface User {
  id: string;
  username: string;
  name: string;
  headline: string;
  avatar: string;
  bannerUrl: string;
  bio: string;
  company: string;
  education: string;
  location: string;
  website: string;
  joinedDate: string;
  connections: string[]; // mutual connections
  followers: string[]; // user IDs following this user
  following: string[]; // user IDs this user follows
  profileViews: number;
  postImpressions: number;
  experiences: ExperienceItem[];
  educations: EducationItem[];
  skills: string[];
}

export type ReactionType = 'like' | 'celebrate' | 'support' | 'love' | 'insightful';

export interface Reaction {
  userId: string;
  type: ReactionType;
}

export interface Post {
  id: string;
  authorId: string;
  content: string;
  mediaUrl?: string;
  tags: string[];
  reactions: Reaction[]; // user reactions
  likes: string[]; // user IDs who reacted
  bookmarks: string[]; // user IDs who saved
  reposts: string[]; // user IDs who reposted
  createdAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  likes: string[];
  createdAt: string;
}

export interface JobListing {
  id: string;
  title: string;
  company: string;
  logo: string;
  location: string;
  type: string;
  salary: string;
  postedDate: string;
  applicants: number;
  description: string;
  tags: string[];
}

export const INITIAL_USERS: User[] = [
  {
    id: 'u1',
    username: 'alexchen',
    name: 'Alex Chen',
    headline: 'Senior Full Stack Engineer @ CodeAlpha | React, Node.js, Express & Distributed Systems',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=300&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1400&q=80',
    bio: 'Passionate about engineering clean, maintainable web applications from end to end. Mentoring interns and building high-throughput microservices.',
    company: 'CodeAlpha Technologies',
    education: 'University of California, Berkeley',
    location: 'San Francisco Bay Area, CA',
    website: 'https://alexchen.dev',
    joinedDate: 'January 2023',
    connections: ['u2', 'u3', 'u4'],
    followers: ['u2', 'u3', 'u4', 'u5'],
    following: ['u2', 'u3'],
    profileViews: 482,
    postImpressions: 4320,
    skills: ['React', 'Express.js', 'Node.js', 'TypeScript', 'PostgreSQL', 'Tailwind CSS', 'Docker'],
    experiences: [
      {
        id: 'exp1',
        title: 'Senior Full Stack Engineer',
        company: 'CodeAlpha Technologies',
        period: '2023 - Present',
        description: 'Architecting end-to-end full stack web platforms, leading frontend performance optimizations and Express.js REST API infrastructure.',
      },
      {
        id: 'exp2',
        title: 'Software Engineer',
        company: 'Stripe',
        period: '2021 - 2023',
        description: 'Engineered high-reliability financial checkout workflows and developed modern web dashboards.',
      },
    ],
    educations: [
      {
        id: 'edu1',
        school: 'UC Berkeley',
        degree: 'B.S. Electrical Engineering & Computer Science',
        period: '2017 - 2021',
      },
    ],
  },
  {
    id: 'u2',
    username: 'sarahm',
    name: 'Sarah Miller',
    headline: 'Lead Product Designer & Design Technologist | Design Systems & Accessible Web UI',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&h=300&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1400&q=80',
    bio: 'Design systems fanatic. Bringing typography, whitespace, and micro-interactions together to create intuitive user experiences.',
    company: 'Figma Community Partner',
    education: 'Rhode Island School of Design',
    location: 'Seattle, WA',
    website: 'https://sarahm.design',
    joinedDate: 'March 2023',
    connections: ['u1', 'u3'],
    followers: ['u1', 'u3', 'u5'],
    following: ['u1', 'u4'],
    profileViews: 620,
    postImpressions: 5910,
    skills: ['Product Design', 'UI/UX', 'Design Systems', 'Figma', 'CSS Architecture', 'Accessibility'],
    experiences: [
      {
        id: 'exp3',
        title: 'Lead Product Designer',
        company: 'DesignFlow Studio',
        period: '2022 - Present',
        description: 'Guiding global product design strategy and tokenized UI design systems for SaaS clients.',
      },
    ],
    educations: [
      {
        id: 'edu2',
        school: 'RISD',
        degree: 'B.F.A. Graphic & Digital Design',
        period: '2018 - 2022',
      },
    ],
  },
  {
    id: 'u3',
    username: 'marcus_v',
    name: 'Marcus Vance',
    headline: 'Cloud Solutions Architect & DevOps Lead | Kubernetes, AWS & Node.js Microservices',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80',
    bio: 'Scaling cloud architectures, continuous integration pipelines, and secure backend microservices for enterprise loads.',
    company: 'CloudScale Infrastructure',
    education: 'Georgia Tech',
    location: 'Austin, TX',
    website: 'https://vance.cloud',
    joinedDate: 'February 2023',
    connections: ['u1', 'u4'],
    followers: ['u1', 'u4', 'u2'],
    following: ['u1', 'u2', 'u4'],
    profileViews: 380,
    postImpressions: 3100,
    skills: ['AWS', 'Docker', 'Kubernetes', 'Express.js', 'CI/CD Pipelines', 'Distributed Systems'],
    experiences: [
      {
        id: 'exp4',
        title: 'Cloud Architect',
        company: 'CloudScale Infrastructure',
        period: '2021 - Present',
        description: 'Managing hybrid-cloud Kubernetes infrastructure serving 10M+ daily API transactions.',
      },
    ],
    educations: [
      {
        id: 'edu3',
        school: 'Georgia Tech',
        degree: 'M.S. Computer Science',
        period: '2019 - 2021',
      },
    ],
  },
  {
    id: 'u4',
    username: 'priya_codes',
    name: 'Priya Patel',
    headline: 'Engineering Manager & Tech Speaker | Building Resilient Frontend Architecture',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&h=300&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1400&q=80',
    bio: 'Advocate for modern web engineering, developer ergonomics, and inclusive tech leadership. Keynote speaker at ReactGlobal 2025.',
    company: 'Vanguard Tech',
    education: 'Carnegie Mellon University',
    location: 'New York, NY',
    website: 'https://priyacodes.io',
    joinedDate: 'April 2023',
    connections: ['u1', 'u3'],
    followers: ['u2', 'u3', 'u1'],
    following: ['u1', 'u3'],
    profileViews: 890,
    postImpressions: 8400,
    skills: ['Engineering Management', 'React 19', 'TypeScript', 'Web Performance', 'REST Architecture'],
    experiences: [
      {
        id: 'exp5',
        title: 'Engineering Manager',
        company: 'Vanguard Tech',
        period: '2023 - Present',
        description: 'Leading a distributed team of 14 engineers building core consumer experience.',
      },
    ],
    educations: [
      {
        id: 'edu4',
        school: 'Carnegie Mellon University',
        degree: 'B.S. Computer Science',
        period: '2016 - 2020',
      },
    ],
  },
  {
    id: 'u5',
    username: 'david_kim',
    name: 'David Kim',
    headline: 'Talent Acquisition & Technical Recruiter @ TechVentures | Hiring Full Stack & Mobile Devs',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&h=300&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=80',
    bio: 'Connecting exceptional engineers with top tier startups and growth-stage tech companies. Feel free to connect!',
    company: 'TechVentures Recruiting',
    education: 'UCLA',
    location: 'Los Angeles, CA',
    website: 'https://techventures.careers',
    joinedDate: 'May 2023',
    connections: [],
    followers: ['u1'],
    following: ['u1', 'u2', 'u3', 'u4'],
    profileViews: 1250,
    postImpressions: 12400,
    skills: ['Technical Recruiting', 'Executive Search', 'Career Coaching', 'Talent Sourcing'],
    experiences: [
      {
        id: 'exp6',
        title: 'Senior Technical Recruiter',
        company: 'TechVentures Recruiting',
        period: '2020 - Present',
        description: 'Placed 150+ engineers in full-stack, DevOps, and machine learning roles.',
      },
    ],
    educations: [
      {
        id: 'edu5',
        school: 'UCLA',
        degree: 'B.A. Business Economics',
        period: '2015 - 2019',
      },
    ],
  },
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'p1',
    authorId: 'u1',
    content: "Excited to share that I have just completed Task 2 for the CodeAlpha Full Stack Web Development Internship! 🚀🎉\n\nBuilt a full-stack social media platform with connected Express.js backend and React frontend:\n✅ User Profiles with Experience & Education\n✅ Dynamic Feed with Posts & Nested Comments\n✅ Full Like/Reaction and Follow/Connection System\n✅ Complete REST API connected on Port 3000\n✅ Clean, exportable source code zip ready for GitHub!\n\nCheck out the architecture below and feel free to connect! #fullstack #codealpha #react #express #webdev #internship",
    mediaUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    tags: ['fullstack', 'codealpha', 'react', 'express', 'webdev', 'internship'],
    reactions: [
      { userId: 'u2', type: 'celebrate' },
      { userId: 'u3', type: 'like' },
      { userId: 'u4', type: 'insightful' },
      { userId: 'u5', type: 'love' },
    ],
    likes: ['u2', 'u3', 'u4', 'u5'],
    bookmarks: ['u2'],
    reposts: ['u2', 'u5'],
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
  },
  {
    id: 'p2',
    authorId: 'u2',
    content: "3 design principles that will immediately elevate your frontend applications:\n\n1. Hierarchy Before Color: If your interface doesn't work in pure grayscale, adding vibrant buttons won't fix poor typography.\n2. Generous Breathing Room: Increase padding between sections by 20%. Space is a feature, not wasted canvas.\n3. Native Feedback: Micro-interactions on like, comment, and connect buttons make web apps feel instantaneous and alive.\n\nWhich UI detail matters most to you? 👇 #design #ux #frontend #typography #productdesign",
    mediaUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
    tags: ['design', 'ux', 'frontend', 'typography', 'productdesign'],
    reactions: [
      { userId: 'u1', type: 'like' },
      { userId: 'u3', type: 'insightful' },
      { userId: 'u4', type: 'love' },
    ],
    likes: ['u1', 'u3', 'u4'],
    bookmarks: ['u1', 'u4'],
    reposts: ['u1'],
    createdAt: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
  },
  {
    id: 'p3',
    authorId: 'u3',
    content: "Why we standardized on Express.js with TypeScript for high-velocity internal microservices:\n\n• Minimal overhead and predictable event loop behavior\n• Seamless middleware chaining for authentication and request parsing\n• Fast cold-start times compared to bulky monolithic frameworks\n• Effortless integration with modern client bundlers like Vite\n\nKeep your APIs focused, type-safe, and well-documented! ☁️⚡️ #devops #nodejs #express #typescript #cloud",
    tags: ['devops', 'nodejs', 'express', 'typescript', 'cloud'],
    reactions: [
      { userId: 'u1', type: 'insightful' },
      { userId: 'u4', type: 'like' },
    ],
    likes: ['u1', 'u4'],
    bookmarks: ['u1'],
    reposts: [],
    createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
  },
  {
    id: 'p4',
    authorId: 'u5',
    content: "📢 We are currently hiring Full Stack Developers (React + Node.js/Express) at TechVentures! Looking for passionate engineers who love building end-to-end web experiences, clean REST APIs, and responsive interfaces.\n\nDrop a comment or send a connection request if you or someone in your network is looking for new opportunities! #hiring #jobs #fullstack #techjobs #careers",
    mediaUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    tags: ['hiring', 'jobs', 'fullstack', 'techjobs', 'careers'],
    reactions: [
      { userId: 'u1', type: 'celebrate' },
      { userId: 'u2', type: 'like' },
      { userId: 'u3', type: 'support' },
    ],
    likes: ['u1', 'u2', 'u3'],
    bookmarks: ['u1'],
    reposts: ['u1'],
    createdAt: new Date(Date.now() - 1000 * 60 * 420).toISOString(),
  },
];

export const INITIAL_COMMENTS: Comment[] = [
  {
    id: 'c1',
    postId: 'p1',
    authorId: 'u2',
    content: "Congratulations Alex! The UI looks super polished and the connected REST endpoints respond instantly. Outstanding work on the internship task! 👏",
    likes: ['u1'],
    createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
  },
  {
    id: 'c2',
    postId: 'p1',
    authorId: 'u5',
    content: "Impressive portfolio project! Demonstrating full-stack architecture with live Express routes is exactly what tech recruiters love to see.",
    likes: ['u1', 'u4'],
    createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  },
  {
    id: 'c3',
    postId: 'p2',
    authorId: 'u1',
    content: "Point #2 about generous spacing is golden. Once you give components proper breathing room, usability improves drastically.",
    likes: ['u2'],
    createdAt: new Date(Date.now() - 1000 * 60 * 70).toISOString(),
  },
  {
    id: 'c4',
    postId: 'p4',
    authorId: 'u1',
    content: "Interested! Sent a connection request and updated my full-stack portfolio.",
    likes: ['u5'],
    createdAt: new Date(Date.now() - 1000 * 60 * 380).toISOString(),
  },
];

export const JOB_LISTINGS: JobListing[] = [
  {
    id: 'job1',
    title: 'Full Stack Web Developer (Intern / Junior)',
    company: 'CodeAlpha Technologies',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=100&h=100&q=80',
    location: 'Remote · Worldwide',
    type: 'Full-time / Internship',
    salary: '$55,000 - $85,000 / yr',
    postedDate: '1 day ago',
    applicants: 42,
    description: 'Work on real-world full-stack web platforms using React, Express.js, TypeScript, and modern database backends.',
    tags: ['React', 'Express.js', 'Node.js', 'REST API'],
  },
  {
    id: 'job2',
    title: 'Frontend React Engineer',
    company: 'TechFlow Global',
    logo: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=100&h=100&q=80',
    location: 'San Francisco, CA (Hybrid)',
    type: 'Full-time',
    salary: '$120,000 - $155,000 / yr',
    postedDate: '3 days ago',
    applicants: 89,
    description: 'Build high-performance web dashboards with React 19, Tailwind CSS, and state management.',
    tags: ['React 19', 'Tailwind CSS', 'TypeScript'],
  },
  {
    id: 'job3',
    title: 'Backend Node.js & Cloud Architect',
    company: 'Vanguard Systems',
    logo: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=100&h=100&q=80',
    location: 'Austin, TX (Remote)',
    type: 'Full-time',
    salary: '$140,000 - $180,000 / yr',
    postedDate: '5 days ago',
    applicants: 31,
    description: 'Design distributed microservices in Node.js and Express with automated container deployments.',
    tags: ['Node.js', 'Express.js', 'Docker', 'AWS'],
  },
];

class Database {
  private users: User[] = JSON.parse(JSON.stringify(INITIAL_USERS));
  private posts: Post[] = JSON.parse(JSON.stringify(INITIAL_POSTS));
  private comments: Comment[] = JSON.parse(JSON.stringify(INITIAL_COMMENTS));
  private currentUserId: string = 'u1';

  reset() {
    this.users = JSON.parse(JSON.stringify(INITIAL_USERS));
    this.posts = JSON.parse(JSON.stringify(INITIAL_POSTS));
    this.comments = JSON.parse(JSON.stringify(INITIAL_COMMENTS));
    this.currentUserId = 'u1';
  }

  getCurrentUserId(): string {
    return this.currentUserId;
  }

  setCurrentUserId(id: string): boolean {
    if (this.users.some(u => u.id === id)) {
      this.currentUserId = id;
      return true;
    }
    return false;
  }

  getCurrentUser(): User | undefined {
    return this.users.find(u => u.id === this.currentUserId);
  }

  getUsers(): User[] {
    return this.users;
  }

  getUserById(id: string): User | undefined {
    return this.users.find(u => u.id === id);
  }

  createUser(userData: Partial<User>): User {
    const newUser: User = {
      id: 'u_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      username: (userData.username || 'user').trim().toLowerCase().replace(/^@/, ''),
      name: userData.name || 'New Member',
      headline: userData.headline || 'Full Stack Developer | Tech Enthusiast',
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&h=300&q=80',
      bannerUrl: userData.bannerUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1400&q=80',
      bio: userData.bio || 'Passionate software developer connecting on LinkedIn.',
      company: userData.company || 'CodeAlpha',
      education: userData.education || 'Computer Science',
      location: userData.location || 'San Francisco, CA',
      website: userData.website || '',
      joinedDate: new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date()),
      connections: [],
      followers: [],
      following: [],
      profileViews: 120,
      postImpressions: 450,
      skills: userData.skills || ['JavaScript', 'React', 'HTML/CSS', 'Node.js'],
      experiences: [
        {
          id: 'exp_' + Date.now(),
          title: 'Software Developer',
          company: userData.company || 'CodeAlpha',
          period: '2024 - Present',
          description: 'Building modern web applications.',
        },
      ],
      educations: [
        {
          id: 'edu_' + Date.now(),
          school: userData.education || 'University of Technology',
          degree: 'B.S. Computer Science',
          period: '2020 - 2024',
        },
      ],
    };
    this.users.push(newUser);
    return newUser;
  }

  updateUser(id: string, updates: Partial<User>): User | undefined {
    const user = this.getUserById(id);
    if (!user) return undefined;
    Object.assign(user, updates);
    return user;
  }

  toggleFollow(followerId: string, targetUserId: string): { isFollowing: boolean; targetUser: User; follower: User } | null {
    if (followerId === targetUserId) return null;
    const targetUser = this.getUserById(targetUserId);
    const follower = this.getUserById(followerId);
    if (!targetUser || !follower) return null;

    const followerIdx = targetUser.followers.indexOf(followerId);
    let isFollowing = false;
    if (followerIdx >= 0) {
      targetUser.followers.splice(followerIdx, 1);
      const followingIdx = follower.following.indexOf(targetUserId);
      if (followingIdx >= 0) follower.following.splice(followingIdx, 1);
      isFollowing = false;
    } else {
      targetUser.followers.push(followerId);
      if (!follower.following.includes(targetUserId)) {
        follower.following.push(targetUserId);
      }
      isFollowing = true;
    }

    return { isFollowing, targetUser, follower };
  }

  toggleConnect(userIdA: string, userIdB: string): { isConnected: boolean; userA: User; userB: User } | null {
    if (userIdA === userIdB) return null;
    const userA = this.getUserById(userIdA);
    const userB = this.getUserById(userIdB);
    if (!userA || !userB) return null;

    const isConnected = userA.connections.includes(userIdB);
    if (isConnected) {
      userA.connections = userA.connections.filter(id => id !== userIdB);
      userB.connections = userB.connections.filter(id => id !== userIdA);
      return { isConnected: false, userA, userB };
    } else {
      userA.connections.push(userIdB);
      userB.connections.push(userIdA);
      // also ensure mutual following
      if (!userA.following.includes(userIdB)) userA.following.push(userIdB);
      if (!userB.following.includes(userIdA)) userB.following.push(userIdA);
      if (!userA.followers.includes(userIdB)) userA.followers.push(userIdB);
      if (!userB.followers.includes(userIdA)) userB.followers.push(userIdA);
      return { isConnected: true, userA, userB };
    }
  }

  getPosts(): Post[] {
    return this.posts;
  }

  getPostById(id: string): Post | undefined {
    return this.posts.find(p => p.id === id);
  }

  createPost(authorId: string, content: string, mediaUrl?: string, tags: string[] = []): Post {
    const newPost: Post = {
      id: 'p_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      authorId,
      content,
      mediaUrl: mediaUrl?.trim() || undefined,
      tags: tags.map(t => t.replace(/^#/, '').toLowerCase().trim()).filter(Boolean),
      reactions: [],
      likes: [],
      bookmarks: [],
      reposts: [],
      createdAt: new Date().toISOString(),
    };
    this.posts.unshift(newPost);
    return newPost;
  }

  deletePost(postId: string, authorId: string): boolean {
    const index = this.posts.findIndex(p => p.id === postId);
    if (index === -1) return false;
    if (this.posts[index].authorId !== authorId) return false;
    this.posts.splice(index, 1);
    this.comments = this.comments.filter(c => c.postId !== postId);
    return true;
  }

  toggleReaction(postId: string, userId: string, reactionType: ReactionType = 'like'): { isLiked: boolean; reactionType: ReactionType; totalReactions: number } | null {
    const post = this.getPostById(postId);
    if (!post) return null;

    const existingReactionIdx = post.reactions.findIndex(r => r.userId === userId);
    let isLiked = false;

    if (existingReactionIdx >= 0) {
      if (post.reactions[existingReactionIdx].type === reactionType) {
        // Remove reaction
        post.reactions.splice(existingReactionIdx, 1);
        post.likes = post.likes.filter(id => id !== userId);
        isLiked = false;
      } else {
        // Change reaction type
        post.reactions[existingReactionIdx].type = reactionType;
        isLiked = true;
      }
    } else {
      // Add reaction
      post.reactions.push({ userId, type: reactionType });
      if (!post.likes.includes(userId)) post.likes.push(userId);
      isLiked = true;
    }

    return {
      isLiked,
      reactionType,
      totalReactions: post.reactions.length,
    };
  }

  toggleBookmarkPost(postId: string, userId: string): { isBookmarked: boolean } | null {
    const post = this.getPostById(postId);
    if (!post) return null;
    const index = post.bookmarks.indexOf(userId);
    let isBookmarked = false;
    if (index >= 0) {
      post.bookmarks.splice(index, 1);
      isBookmarked = false;
    } else {
      post.bookmarks.push(userId);
      isBookmarked = true;
    }
    return { isBookmarked };
  }

  toggleRepost(postId: string, userId: string): { isReposted: boolean; count: number } | null {
    const post = this.getPostById(postId);
    if (!post) return null;
    const idx = post.reposts.indexOf(userId);
    let isReposted = false;
    if (idx >= 0) {
      post.reposts.splice(idx, 1);
      isReposted = false;
    } else {
      post.reposts.push(userId);
      isReposted = true;
    }
    return { isReposted, count: post.reposts.length };
  }

  getCommentsByPost(postId: string): Comment[] {
    return this.comments.filter(c => c.postId === postId);
  }

  addComment(postId: string, authorId: string, content: string): Comment | null {
    const post = this.getPostById(postId);
    if (!post) return null;
    const newComment: Comment = {
      id: 'c_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      postId,
      authorId,
      content,
      likes: [],
      createdAt: new Date().toISOString(),
    };
    this.comments.push(newComment);
    return newComment;
  }

  deleteComment(commentId: string, userId: string): boolean {
    const index = this.comments.findIndex(c => c.id === commentId);
    if (index === -1) return false;
    if (this.comments[index].authorId !== userId) return false;
    this.comments.splice(index, 1);
    return true;
  }

  getJobs(): JobListing[] {
    return JOB_LISTINGS;
  }

  getStats() {
    return {
      users: this.users.length,
      posts: this.posts.length,
      comments: this.comments.length,
      jobs: JOB_LISTINGS.length,
    };
  }
}

export const db = new Database();
