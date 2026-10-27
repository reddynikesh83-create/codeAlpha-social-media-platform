import React from 'react';
import { UserProfile } from '../types';
import { UserPlus, UserCheck, TrendingUp, Sparkles, Hash } from 'lucide-react';

interface WhoToFollowProps {
  users: UserProfile[];
  currentUser: UserProfile;
  onToggleFollow: (userId: string) => void;
  onSelectUser: (userId: string) => void;
  onSelectTag: (tag: string) => void;
  selectedTag: string;
}

const POPULAR_TAGS = [
  { name: 'fullstack', count: 18 },
  { name: 'react', count: 24 },
  { name: 'express', count: 15 },
  { name: 'nodejs', count: 12 },
  { name: 'design', count: 9 },
  { name: 'webdev', count: 31 },
];

export const WhoToFollow: React.FC<WhoToFollowProps> = ({
  users,
  currentUser,
  onToggleFollow,
  onSelectUser,
  onSelectTag,
  selectedTag,
}) => {
  // Filter out currentUser from suggested list
  const suggestedUsers = users.filter((u) => u.id !== currentUser.id);

  return (
    <div className="space-y-4">
      {/* Popular Topics / Tags card */}
      <div className="bg-white rounded-2xl border border-zinc-200/90 shadow-xs p-4">
        <div className="flex items-center gap-2 mb-3 text-xs font-bold text-zinc-900 uppercase tracking-wider">
          <TrendingUp className="w-4 h-4 text-sky-600" />
          <span>Trending Topics</span>
        </div>

        <div className="space-y-1.5">
          {POPULAR_TAGS.map((t) => {
            const isSelected = selectedTag === t.name;
            return (
              <button
                key={t.name}
                onClick={() => onSelectTag(isSelected ? '' : t.name)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left text-xs transition-colors ${
                  isSelected
                    ? 'bg-sky-50 text-sky-800 font-semibold'
                    : 'hover:bg-zinc-50 text-zinc-700'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-zinc-400" />
                  <span>#{t.name}</span>
                </div>
                <span className="text-[11px] text-zinc-400 font-normal">
                  {t.count} posts
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Suggested Creators card */}
      <div className="bg-white rounded-2xl border border-zinc-200/90 shadow-xs p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-900 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Suggested Creators</span>
          </div>
        </div>

        <div className="space-y-3">
          {suggestedUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between gap-2 text-left group"
            >
              <button
                onClick={() => onSelectUser(user.id)}
                className="flex items-center gap-2.5 flex-1 min-w-0 text-left"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-9 h-9 rounded-full object-cover border border-zinc-200 shrink-0 group-hover:ring-2 group-hover:ring-sky-400 transition-all"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-zinc-900 truncate group-hover:text-sky-600 transition-colors">
                    {user.name}
                  </div>
                  <div className="text-[11px] text-zinc-400 truncate">
                    @{user.username}
                  </div>
                </div>
              </button>

              <button
                onClick={() => onToggleFollow(user.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors shrink-0 ${
                  user.isFollowing
                    ? 'bg-zinc-100 text-zinc-700 hover:bg-rose-50 hover:text-rose-600'
                    : 'bg-zinc-900 hover:bg-zinc-800 text-white'
                }`}
              >
                {user.isFollowing ? (
                  <>
                    <UserCheck className="w-3 h-3" />
                    <span>Following</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3 h-3" />
                    <span>Follow</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Task 2 info box */}
      <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 text-xs text-zinc-600 space-y-1.5">
        <div className="font-semibold text-zinc-800">CodeAlpha Internship Task 2</div>
        <p className="text-[11px] leading-relaxed text-zinc-500">
          Features implemented: User profiles, Posts, Comments, Likes, and Follower/Following system connected via Express.js REST API.
        </p>
      </div>
    </div>
  );
};
