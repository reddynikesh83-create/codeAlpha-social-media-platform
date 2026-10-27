import React from 'react';
import { UserProfile } from '../types';
import { Users, UserPlus, UserCheck, Check, X, ShieldCheck } from 'lucide-react';

interface MyNetworkViewProps {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  onConnect: (userId: string) => void;
  onFollow: (userId: string) => void;
  onSelectUser: (userId: string) => void;
}

export const MyNetworkView: React.FC<MyNetworkViewProps> = ({
  currentUser,
  allUsers,
  onConnect,
  onFollow,
  onSelectUser,
}) => {
  const otherUsers = allUsers.filter((u) => u.id !== currentUser.id);
  const connectedUsers = otherUsers.filter((u) => u.isConnected);
  const recommendedUsers = otherUsers.filter((u) => !u.isConnected);

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      
      {/* Network Overview Bar */}
      <div className="bg-white rounded-xl border border-zinc-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-zinc-900">Manage My Network</h2>
          <p className="text-xs text-zinc-500">
            Connect with professionals, software engineers, and mentors in your industry.
          </p>
        </div>

        <div className="flex items-center gap-6 text-xs">
          <div>
            <span className="font-bold text-zinc-900 text-sm">{currentUser.connectionCount}</span>{' '}
            <span className="text-zinc-500">Connections</span>
          </div>
          <div>
            <span className="font-bold text-zinc-900 text-sm">{currentUser.followingCount}</span>{' '}
            <span className="text-zinc-500">Following</span>
          </div>
          <div>
            <span className="font-bold text-zinc-900 text-sm">{currentUser.followerCount}</span>{' '}
            <span className="text-zinc-500">Followers</span>
          </div>
        </div>
      </div>

      {/* 1st Degree Connections */}
      {connectedUsers.length > 0 && (
        <div className="bg-white rounded-xl border border-zinc-200 p-4 shadow-xs">
          <div className="flex items-center justify-between mb-3 border-b border-zinc-100 pb-2">
            <h3 className="font-bold text-sm text-zinc-900 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>Your 1st Degree Connections ({connectedUsers.length})</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {connectedUsers.map((user) => (
              <div
                key={user.id}
                className="p-3 border border-zinc-200 rounded-xl flex items-center gap-3 hover:border-zinc-300 transition-colors"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover border border-zinc-200 shrink-0 cursor-pointer"
                  onClick={() => onSelectUser(user.id)}
                />
                <div className="min-w-0 flex-1">
                  <div
                    onClick={() => onSelectUser(user.id)}
                    className="font-bold text-xs text-zinc-900 hover:text-[#0a66c2] hover:underline cursor-pointer truncate"
                  >
                    {user.name}
                  </div>
                  <div className="text-[11px] text-zinc-500 line-clamp-1">{user.headline}</div>
                  <button
                    onClick={() => onConnect(user.id)}
                    className="mt-1.5 text-[10px] text-zinc-500 hover:text-rose-600 font-semibold"
                  >
                    Remove Connection
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* People You May Know */}
      <div className="bg-white rounded-xl border border-zinc-200 p-4 shadow-xs">
        <div className="flex items-center justify-between mb-4 border-b border-zinc-100 pb-2">
          <h3 className="font-bold text-sm text-zinc-900">
            People you may know based on your recent activity
          </h3>
          <span className="text-xs text-zinc-400">CodeAlpha Network</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendedUsers.map((user) => (
            <div
              key={user.id}
              className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-2xs hover:shadow-sm transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="h-14 bg-gradient-to-r from-sky-500 to-indigo-600 relative">
                  {user.bannerUrl && (
                    <img src={user.bannerUrl} alt="banner" className="w-full h-full object-cover" />
                  )}
                </div>

                <div className="px-3 pb-2 text-center -mt-8">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-16 h-16 rounded-full border-2 border-white object-cover mx-auto shadow-sm cursor-pointer hover:brightness-95"
                    onClick={() => onSelectUser(user.id)}
                  />
                  <div
                    onClick={() => onSelectUser(user.id)}
                    className="font-bold text-xs text-zinc-900 hover:text-[#0a66c2] hover:underline cursor-pointer mt-1.5 truncate"
                  >
                    {user.name}
                  </div>
                  <div className="text-[11px] text-zinc-500 line-clamp-2 mt-0.5 min-h-[32px] px-2">
                    {user.headline}
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-1">
                    {user.company} · {user.location}
                  </div>
                </div>
              </div>

              <div className="p-3 border-t border-zinc-100 mt-2">
                <button
                  onClick={() => onConnect(user.id)}
                  className="w-full py-1.5 px-3 rounded-full border border-[#0a66c2] text-[#0a66c2] hover:bg-sky-50 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Connect</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
