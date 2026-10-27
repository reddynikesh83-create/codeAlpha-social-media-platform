import React, { useState } from 'react';
import { UserProfile } from '../types';
import { 
  Download, 
  Check, 
  TrendingUp, 
  UserPlus, 
  UserCheck, 
  Sparkles, 
  ExternalLink,
  Github,
  Info
} from 'lucide-react';

interface RightSidebarProps {
  users: UserProfile[];
  currentUser: UserProfile;
  onConnect: (userId: string) => void;
  onFollow: (userId: string) => void;
  onSelectUser: (userId: string) => void;
  onDownloadZip: () => void;
}

const LINKEDIN_NEWS = [
  { title: 'Full Stack Web Dev surges in demand', time: '3h ago', readers: '12,450 readers' },
  { title: 'Express.js & TypeScript microservices', time: '5h ago', readers: '8,120 readers' },
  { title: 'React 19 Server actions in production', time: '1d ago', readers: '19,300 readers' },
  { title: 'CodeAlpha internship task 2 submissions', time: '2d ago', readers: '4,280 readers' },
  { title: 'Clean Architecture in modern web apps', time: '3d ago', readers: '9,840 readers' },
];

export const RightSidebar: React.FC<RightSidebarProps> = ({
  users,
  currentUser,
  onConnect,
  onFollow,
  onSelectUser,
  onDownloadZip,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownload = () => {
    onDownloadZip();
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const suggestedUsers = users.filter((u) => u.id !== currentUser.id);

  return (
    <div className="space-y-2.5">
      
      {/* 1. Download Project ZIP Box (CodeAlpha Requirement) */}
      <div className="bg-gradient-to-br from-white to-sky-50/50 rounded-xl border border-sky-200 p-4 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 bg-[#0a66c2] text-white rounded-lg">
            <Download className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-zinc-900 leading-tight">
              Export Project ZIP
            </h4>
            <span className="text-[10px] text-zinc-500">CodeAlpha Task 2 Deliverable</span>
          </div>
        </div>

        <p className="text-[11px] text-zinc-600 mb-3 leading-relaxed">
          Download the complete connected frontend & Express.js backend codebase bundled and ready to upload to GitHub.
        </p>

        <button
          onClick={handleDownload}
          className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs ${
            downloadSuccess
              ? 'bg-emerald-600 text-white'
              : 'bg-[#0a66c2] hover:bg-[#004182] text-white'
          }`}
        >
          {downloadSuccess ? (
            <>
              <Check className="w-4 h-4" />
              <span>ZIP Download Started!</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Download Project ZIP</span>
            </>
          )}
        </button>

        <div className="mt-2 text-[10px] text-zinc-400 text-center">
          Filename: CodeAlpha_Task2_SocialMediaPlatform.zip
        </div>
      </div>

      {/* 2. LinkedIn News / Trending in Tech */}
      <div className="bg-white rounded-xl border border-zinc-200 p-3.5 shadow-xs">
        <div className="flex items-center justify-between mb-2.5">
          <h4 className="font-bold text-xs text-zinc-900">LinkedIn News</h4>
          <Info className="w-3.5 h-3.5 text-zinc-400" />
        </div>

        <div className="space-y-2.5">
          {LINKEDIN_NEWS.map((item, idx) => (
            <div key={idx} className="cursor-pointer group">
              <div className="text-xs font-semibold text-zinc-800 group-hover:text-[#0a66c2] leading-snug line-clamp-1">
                • {item.title}
              </div>
              <div className="text-[10px] text-zinc-400 mt-0.5 ml-2.5">
                {item.time} · {item.readers}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Add to your feed (Suggested Connections) */}
      <div className="bg-white rounded-xl border border-zinc-200 p-3.5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-bold text-xs text-zinc-900">Add to your feed</h4>
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
        </div>

        <div className="space-y-3">
          {suggestedUsers.map((user) => (
            <div key={user.id} className="flex items-start gap-2.5">
              <button
                onClick={() => onSelectUser(user.id)}
                className="shrink-0"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover border border-zinc-200 hover:brightness-95 transition-all"
                />
              </button>

              <div className="min-w-0 flex-1">
                <button
                  onClick={() => onSelectUser(user.id)}
                  className="text-xs font-bold text-zinc-900 hover:text-[#0a66c2] hover:underline text-left truncate block"
                >
                  {user.name}
                </button>
                <p className="text-[10px] text-zinc-500 line-clamp-1 leading-tight">
                  {user.headline}
                </p>

                <div className="mt-1.5 flex items-center gap-1.5">
                  <button
                    onClick={() => onConnect(user.id)}
                    className={`px-3 py-1 rounded-full text-[11px] font-semibold border flex items-center gap-1 transition-colors ${
                      user.isConnected
                        ? 'border-zinc-300 text-zinc-700 bg-zinc-50'
                        : 'border-[#0a66c2] text-[#0a66c2] hover:bg-sky-50'
                    }`}
                  >
                    {user.isConnected ? (
                      <>
                        <UserCheck className="w-3 h-3" />
                        <span>Connected</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3 h-3" />
                        <span>Connect</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Links */}
      <div className="text-[10px] text-zinc-400 text-center space-x-2 pt-1 leading-relaxed">
        <span>About</span>
        <span>·</span>
        <span>Accessibility</span>
        <span>·</span>
        <span>CodeAlpha Task 2</span>
        <span>·</span>
        <span>LinkedIn Clone © 2026</span>
      </div>

    </div>
  );
};
