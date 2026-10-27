import React from 'react';
import { UserProfile } from '../types';
import { Bookmark, Users, Hash, Award, TrendingUp } from 'lucide-react';

interface LeftSidebarProps {
  currentUser: UserProfile;
  activeFeed: 'all' | 'following' | 'bookmarks';
  selectedTag: string;
  onSelectFeed: (feed: 'all' | 'following' | 'bookmarks') => void;
  onSelectTag: (tag: string) => void;
  onOpenProfile: (userId: string) => void;
  onOpenConnections: () => void;
}

const FOLLOWED_HASHTAGS = [
  'fullstack',
  'react',
  'express',
  'nodejs',
  'typescript',
  'codealpha',
  'webdev',
];

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  currentUser,
  activeFeed,
  selectedTag,
  onSelectFeed,
  onSelectTag,
  onOpenProfile,
  onOpenConnections,
}) => {
  return (
    <div className="space-y-2.5">
      
      {/* Profile Summary Card */}
      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-xs">
        {/* Cover photo */}
        <div className="h-16 bg-gradient-to-r from-sky-600 via-indigo-600 to-blue-700 relative">
          {currentUser.bannerUrl && (
            <img
              src={currentUser.bannerUrl}
              alt="Profile cover"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Avatar & Info */}
        <div className="px-4 pb-4 pt-0 text-center relative border-b border-zinc-100">
          <div className="flex justify-center -mt-9 mb-2">
            <button
              onClick={() => onOpenProfile(currentUser.id)}
              className="relative group focus:outline-none"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-18 h-18 rounded-full border-2 border-white object-cover shadow-sm bg-white group-hover:brightness-95 transition-all"
              />
            </button>
          </div>

          <button
            onClick={() => onOpenProfile(currentUser.id)}
            className="font-bold text-sm text-zinc-900 hover:underline block mx-auto leading-snug"
          >
            {currentUser.name}
          </button>
          
          <p className="text-[12px] text-zinc-500 line-clamp-2 mt-1 leading-tight">
            {currentUser.headline}
          </p>

          <p className="text-[11px] text-zinc-400 mt-1">
            {currentUser.company} · {currentUser.location}
          </p>
        </div>

        {/* Stats Section */}
        <div className="py-2 border-b border-zinc-100 text-xs">
          <button
            onClick={onOpenConnections}
            className="w-full px-4 py-1.5 flex items-center justify-between hover:bg-zinc-50 transition-colors text-left"
          >
            <div>
              <div className="text-[11px] font-semibold text-zinc-500">Connections</div>
              <div className="text-[10px] text-zinc-400">Grow your network</div>
            </div>
            <span className="font-bold text-[#0a66c2] text-xs">
              {currentUser.connectionCount}
            </span>
          </button>

          <div className="px-4 py-1.5 flex items-center justify-between text-left">
            <div>
              <div className="text-[11px] font-semibold text-zinc-500">Profile viewers</div>
              <div className="text-[10px] text-zinc-400">Past 90 days</div>
            </div>
            <span className="font-bold text-[#0a66c2] text-xs">
              {currentUser.profileViews}
            </span>
          </div>

          <div className="px-4 py-1.5 flex items-center justify-between text-left">
            <div>
              <div className="text-[11px] font-semibold text-zinc-500">Post impressions</div>
              <div className="text-[10px] text-zinc-400">Organic reach</div>
            </div>
            <span className="font-bold text-[#0a66c2] text-xs">
              {currentUser.postImpressions}
            </span>
          </div>
        </div>

        {/* Quick Feed Filters */}
        <div className="p-2 space-y-0.5 text-xs">
          <button
            onClick={() => onSelectFeed('all')}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left font-medium transition-colors ${
              activeFeed === 'all' && !selectedTag
                ? 'bg-sky-50 text-[#0a66c2]'
                : 'text-zinc-600 hover:bg-zinc-50'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Feed (Top Updates)</span>
          </button>

          <button
            onClick={() => onSelectFeed('following')}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left font-medium transition-colors ${
              activeFeed === 'following' && !selectedTag
                ? 'bg-sky-50 text-[#0a66c2]'
                : 'text-zinc-600 hover:bg-zinc-50'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Following & Network</span>
          </button>

          <button
            onClick={() => onSelectFeed('bookmarks')}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left font-medium transition-colors ${
              activeFeed === 'bookmarks' && !selectedTag
                ? 'bg-sky-50 text-[#0a66c2]'
                : 'text-zinc-600 hover:bg-zinc-50'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>My Saved Items</span>
          </button>
        </div>

      </div>

      {/* Followed Hashtags & Topics */}
      <div className="bg-white rounded-xl border border-zinc-200 p-3 shadow-xs text-xs">
        <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
          Followed Hashtags
        </div>
        <div className="space-y-1">
          {FOLLOWED_HASHTAGS.map((tag) => {
            const isSelected = selectedTag === tag;
            return (
              <button
                key={tag}
                onClick={() => onSelectTag(isSelected ? '' : tag)}
                className={`w-full flex items-center gap-1.5 px-2 py-1.5 rounded-md text-left transition-colors ${
                  isSelected
                    ? 'bg-sky-100 text-[#0a66c2] font-semibold'
                    : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                }`}
              >
                <Hash className="w-3 h-3 text-zinc-400" />
                <span>#{tag}</span>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
