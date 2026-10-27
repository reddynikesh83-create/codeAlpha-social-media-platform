import React, { useEffect, useState } from 'react';
import { UserProfile, SocialPost, ReactionType } from '../types';
import { api } from '../api';
import { 
  X, 
  MapPin, 
  Globe, 
  Calendar, 
  Edit3, 
  UserPlus, 
  UserCheck, 
  Briefcase, 
  GraduationCap, 
  Award,
  Share2,
  Check
} from 'lucide-react';
import { PostCard } from './PostCard';

interface UserProfileModalProps {
  userId: string;
  currentUser: UserProfile;
  onClose: () => void;
  onOpenEditProfile: () => void;
  onPostUpdated: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  userId,
  currentUser,
  onClose,
  onOpenEditProfile,
  onPostUpdated,
}) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userPosts, setUserPosts] = useState<SocialPost[]>([]);
  const [connections, setConnections] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectLoading, setConnectLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const data = await api.getUserProfile(userId);
      setProfile(data.profile);
      setUserPosts(data.posts);
      setConnections(data.connections);
    } catch (err) {
      console.error('Failed to load profile', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [userId]);

  const handleToggleConnect = async () => {
    if (!profile || connectLoading) return;
    setConnectLoading(true);
    try {
      const res = await api.toggleConnect(profile.id);
      setProfile(res.targetUser);
      onPostUpdated();
    } catch (err) {
      console.error(err);
    } finally {
      setConnectLoading(false);
    }
  };

  const handleToggleFollow = async () => {
    if (!profile) return;
    try {
      const res = await api.toggleFollow(profile.id);
      setProfile(res.targetUser);
      onPostUpdated();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReactPost = async (postId: string, type: ReactionType) => {
    try {
      await api.reactToPost(postId, type);
      fetchProfileData();
      onPostUpdated();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRepost = async (postId: string) => {
    try {
      await api.toggleRepost(postId);
      fetchProfileData();
      onPostUpdated();
    } catch (err) {
      console.error(err);
    }
  };

  const handleBookmarkPost = async (postId: string) => {
    try {
      await api.toggleBookmarkPost(postId);
      fetchProfileData();
      onPostUpdated();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await api.deletePost(postId);
      fetchProfileData();
      onPostUpdated();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (postId: string, content: string) => {
    await api.addComment(postId, content);
    fetchProfileData();
    onPostUpdated();
  };

  const handleDeleteComment = async (commentId: string) => {
    await api.deleteComment(commentId);
    fetchProfileData();
    onPostUpdated();
  };

  const copyProfileLink = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading || !profile) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center">
          <div className="w-10 h-10 border-4 border-[#0a66c2] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-zinc-500 font-medium">Loading LinkedIn profile...</p>
        </div>
      </div>
    );
  }

  const isSelf = currentUser.id === profile.id;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      <div className="bg-[#f3f2ef] rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-zinc-200">
        
        {/* Top Header */}
        <div className="px-5 py-3 bg-white border-b border-zinc-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-zinc-900">{profile.name}</span>
            <span className="text-xs text-zinc-400">· {profile.headline}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Container */}
        <div className="overflow-y-auto flex-1 p-3 sm:p-4 space-y-3">
          
          {/* Main Profile Header Card */}
          <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-xs">
            {/* Banner Cover */}
            <div className="h-32 sm:h-44 bg-gradient-to-r from-sky-600 via-indigo-600 to-blue-700 relative">
              {profile.bannerUrl && (
                <img
                  src={profile.bannerUrl}
                  alt="Banner"
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Avatar & Action row */}
            <div className="px-5 pb-5 relative">
              <div className="flex justify-between items-end -mt-16 sm:-mt-20 mb-3">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-white object-cover shadow-md bg-white"
                />

                <div className="flex items-center gap-2">
                  <button
                    onClick={copyProfileLink}
                    className="p-2 border border-zinc-300 rounded-full hover:bg-zinc-50 text-zinc-600 transition-colors"
                    title="Share profile"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                  </button>

                  {isSelf ? (
                    <button
                      onClick={onOpenEditProfile}
                      className="flex items-center gap-1.5 px-4 py-2 border border-zinc-300 rounded-full text-xs font-semibold text-zinc-800 hover:bg-zinc-50 transition-colors shadow-xs"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Profile</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleToggleConnect}
                        disabled={connectLoading}
                        className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-bold shadow-xs transition-colors ${
                          profile.isConnected
                            ? 'bg-zinc-100 text-zinc-800 border border-zinc-300 hover:bg-zinc-200'
                            : 'bg-[#0a66c2] hover:bg-[#004182] text-white'
                        }`}
                      >
                        {profile.isConnected ? (
                          <>
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>1st Degree Connection</span>
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-3.5 h-3.5" />
                            <span>Connect</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={handleToggleFollow}
                        className={`px-4 py-2 rounded-full text-xs font-semibold border transition-colors ${
                          profile.isFollowing
                            ? 'border-zinc-300 text-zinc-700 hover:bg-zinc-100'
                            : 'border-[#0a66c2] text-[#0a66c2] hover:bg-sky-50'
                        }`}
                      >
                        {profile.isFollowing ? 'Following' : 'Follow'}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Identity & Headline */}
              <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 leading-tight">
                {profile.name}
              </h1>
              <p className="text-xs sm:text-sm text-zinc-700 mt-1 leading-snug">
                {profile.headline}
              </p>

              {/* Location & Contact Info */}
              <div className="flex items-center gap-3 text-xs text-zinc-500 mt-2 flex-wrap">
                <span>{profile.location}</span>
                <span>·</span>
                {profile.website && (
                  <>
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#0a66c2] hover:underline font-semibold"
                    >
                      Contact Info
                    </a>
                    <span>·</span>
                  </>
                )}
                <span className="font-bold text-[#0a66c2]">
                  {profile.connectionCount} connections
                </span>
                <span>·</span>
                <span>{profile.followerCount} followers</span>
              </div>
            </div>
          </div>

          {/* About Section */}
          {profile.bio && (
            <div className="bg-white rounded-xl border border-zinc-200 p-5 shadow-xs">
              <h3 className="text-sm font-bold text-zinc-900 mb-2">About</h3>
              <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed whitespace-pre-wrap">
                {profile.bio}
              </p>
            </div>
          )}

          {/* Experience Section */}
          <div className="bg-white rounded-xl border border-zinc-200 p-5 shadow-xs">
            <h3 className="text-sm font-bold text-zinc-900 mb-3 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#0a66c2]" />
              <span>Experience</span>
            </h3>

            <div className="space-y-4">
              {profile.experiences && profile.experiences.length > 0 ? (
                profile.experiences.map((exp) => (
                  <div key={exp.id} className="border-b border-zinc-100 last:border-b-0 pb-3 last:pb-0">
                    <div className="font-bold text-xs sm:text-sm text-zinc-900">
                      {exp.title}
                    </div>
                    <div className="text-xs font-semibold text-zinc-700">
                      {exp.company}
                    </div>
                    <div className="text-[11px] text-zinc-400 mt-0.5">
                      {exp.period}
                    </div>
                    {exp.description && (
                      <p className="text-xs text-zinc-600 mt-1.5 leading-relaxed">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-xs text-zinc-500">
                  {profile.company || 'Software Engineer at CodeAlpha Technologies'}
                </div>
              )}
            </div>
          </div>

          {/* Education Section */}
          <div className="bg-white rounded-xl border border-zinc-200 p-5 shadow-xs">
            <h3 className="text-sm font-bold text-zinc-900 mb-3 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-[#0a66c2]" />
              <span>Education</span>
            </h3>

            <div className="space-y-3">
              {profile.educations && profile.educations.length > 0 ? (
                profile.educations.map((edu) => (
                  <div key={edu.id}>
                    <div className="font-bold text-xs sm:text-sm text-zinc-900">
                      {edu.school}
                    </div>
                    <div className="text-xs text-zinc-600">
                      {edu.degree}
                    </div>
                    <div className="text-[11px] text-zinc-400 mt-0.5">
                      {edu.period}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-zinc-600">
                  {profile.education || 'B.S. Computer Science'}
                </div>
              )}
            </div>
          </div>

          {/* Skills Section */}
          {profile.skills && profile.skills.length > 0 && (
            <div className="bg-white rounded-xl border border-zinc-200 p-5 shadow-xs">
              <h3 className="text-sm font-bold text-zinc-900 mb-3 flex items-center gap-2">
                <Award className="w-4 h-4 text-[#0a66c2]" />
                <span>Skills & Endorsements</span>
              </h3>

              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-full text-xs font-semibold transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Activity / Posts Section */}
          <div className="bg-white rounded-xl border border-zinc-200 p-5 shadow-xs">
            <h3 className="text-sm font-bold text-zinc-900 mb-3">
              Activity ({userPosts.length} posts)
            </h3>

            {userPosts.length === 0 ? (
              <p className="text-xs text-zinc-400 py-3 text-center">
                No recent activity by {profile.name}.
              </p>
            ) : (
              <div className="space-y-3">
                {userPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    currentUser={currentUser}
                    onReact={handleReactPost}
                    onRepost={handleRepost}
                    onBookmark={handleBookmarkPost}
                    onDelete={handleDeletePost}
                    onFollowAuthor={handleToggleFollow}
                    onConnectAuthor={handleToggleConnect}
                    onOpenProfile={() => {}}
                    onSelectTag={() => {}}
                    onAddComment={handleAddComment}
                    onDeleteComment={handleDeleteComment}
                  />
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
