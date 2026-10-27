export type ReactionType = 'like' | 'celebrate' | 'support' | 'love' | 'insightful';

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

export interface UserProfile {
  id: string;
  username: string;
  name: string;
  headline: string;
  avatar: string;
  bannerUrl?: string;
  bio: string;
  company: string;
  education: string;
  location: string;
  website: string;
  joinedDate: string;
  connectionCount: number;
  followerCount: number;
  followingCount: number;
  profileViews: number;
  postImpressions: number;
  isConnected: boolean;
  isFollowing: boolean;
  isSelf: boolean;
  skills: string[];
  experiences: ExperienceItem[];
  educations: EducationItem[];
}

export interface PostComment {
  id: string;
  postId: string;
  authorId: string;
  author: {
    id: string;
    username: string;
    name: string;
    avatar: string;
    headline?: string;
  };
  content: string;
  likes: string[];
  likeCount: number;
  isLiked: boolean;
  createdAt: string;
}

export interface SocialPost {
  id: string;
  authorId: string;
  author: {
    id: string;
    username: string;
    name: string;
    avatar: string;
    headline?: string;
    company?: string;
    bio?: string;
  };
  content: string;
  mediaUrl?: string;
  tags: string[];
  likes: string[];
  bookmarks: string[];
  reposts: string[];
  reactionCounts: Record<ReactionType, number>;
  totalReactions: number;
  likeCount: number;
  userReaction: ReactionType | null;
  commentCount: number;
  repostCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
  isReposted: boolean;
  createdAt: string;
  comments: PostComment[];
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
  hasApplied?: boolean;
}

export interface BackendHealth {
  status: string;
  backend: string;
  timestamp: string;
  activeUserId: string;
  stats: {
    users: number;
    posts: number;
    comments: number;
    jobs: number;
  };
}
