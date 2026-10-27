import { UserProfile, SocialPost, PostComment, BackendHealth, ReactionType, JobListing } from './types';

export const api = {
  async getHealth(): Promise<BackendHealth> {
    const res = await fetch('/api/health');
    if (!res.ok) throw new Error('Backend health check failed');
    return res.json();
  },

  async getSession(): Promise<{ currentUserId: string; currentUser: UserProfile }> {
    const res = await fetch('/api/session');
    if (!res.ok) throw new Error('Failed to fetch session');
    return res.json();
  },

  async switchSession(userId: string): Promise<{ currentUserId: string; currentUser: UserProfile }> {
    const res = await fetch('/api/session/switch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    if (!res.ok) throw new Error('Failed to switch user');
    return res.json();
  },

  async getUsers(search?: string): Promise<UserProfile[]> {
    const url = search ? `/api/users?q=${encodeURIComponent(search)}` : '/api/users';
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
  },

  async createUser(userData: Partial<UserProfile>): Promise<UserProfile> {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to create user' }));
      throw new Error(err.error || 'Failed to create user');
    }
    return res.json();
  },

  async getUserProfile(id: string): Promise<{
    profile: UserProfile;
    posts: SocialPost[];
    connections: UserProfile[];
    followers: UserProfile[];
    following: UserProfile[];
  }> {
    const res = await fetch(`/api/users/${id}`);
    if (!res.ok) throw new Error('Failed to fetch user profile');
    return res.json();
  },

  async updateProfile(id: string, data: Partial<UserProfile>): Promise<UserProfile> {
    const res = await fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return res.json();
  },

  async toggleFollow(targetUserId: string): Promise<{
    isFollowing: boolean;
    targetUser: UserProfile;
    currentUser: UserProfile;
  }> {
    const res = await fetch(`/api/users/${targetUserId}/follow`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to toggle follow');
    return res.json();
  },

  async toggleConnect(targetUserId: string): Promise<{
    isConnected: boolean;
    targetUser: UserProfile;
    currentUser: UserProfile;
  }> {
    const res = await fetch(`/api/users/${targetUserId}/connect`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to toggle connection');
    return res.json();
  },

  async getPosts(params?: {
    feed?: 'all' | 'following' | 'bookmarks' | 'user';
    userId?: string;
    tag?: string;
    q?: string;
  }): Promise<SocialPost[]> {
    const query = new URLSearchParams();
    if (params?.feed) query.set('feed', params.feed);
    if (params?.userId) query.set('userId', params.userId);
    if (params?.tag) query.set('tag', params.tag);
    if (params?.q) query.set('q', params.q);

    const res = await fetch(`/api/posts?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch posts');
    return res.json();
  },

  async createPost(data: { content: string; mediaUrl?: string; tags?: string[] }): Promise<SocialPost> {
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to create post' }));
      throw new Error(err.error || 'Failed to create post');
    }
    return res.json();
  },

  async deletePost(id: string): Promise<void> {
    const res = await fetch(`/api/posts/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete post');
  },

  async reactToPost(postId: string, type: ReactionType): Promise<SocialPost> {
    const res = await fetch(`/api/posts/${postId}/react`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type }),
    });
    if (!res.ok) throw new Error('Failed to react to post');
    return res.json();
  },

  async toggleRepost(postId: string): Promise<{ isReposted: boolean; count: number }> {
    const res = await fetch(`/api/posts/${postId}/repost`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to toggle repost');
    return res.json();
  },

  async toggleBookmarkPost(postId: string): Promise<{ isBookmarked: boolean }> {
    const res = await fetch(`/api/posts/${postId}/bookmark`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to toggle bookmark');
    return res.json();
  },

  async getComments(postId: string): Promise<PostComment[]> {
    const res = await fetch(`/api/posts/${postId}/comments`);
    if (!res.ok) throw new Error('Failed to fetch comments');
    return res.json();
  },

  async addComment(postId: string, content: string): Promise<PostComment> {
    const res = await fetch(`/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    if (!res.ok) throw new Error('Failed to add comment');
    return res.json();
  },

  async deleteComment(commentId: string): Promise<void> {
    const res = await fetch(`/api/comments/${commentId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete comment');
  },

  async getJobs(): Promise<JobListing[]> {
    const res = await fetch('/api/jobs');
    if (!res.ok) throw new Error('Failed to fetch jobs');
    return res.json();
  },

  async applyJob(jobId: string): Promise<{ message: string; job: JobListing }> {
    const res = await fetch(`/api/jobs/${jobId}/apply`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to apply for job');
    return res.json();
  },

  async resetDemo(): Promise<void> {
    const res = await fetch('/api/reset-demo', {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to reset demo');
  },

  getDownloadZipUrl(): string {
    return '/api/download-zip';
  },
};
