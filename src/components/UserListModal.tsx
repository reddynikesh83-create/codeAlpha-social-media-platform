import React from 'react';
import { UserProfile } from '../types';
import { X, UserPlus, UserCheck } from 'lucide-react';

interface UserListModalProps {
  title: string;
  users: UserProfile[];
  currentUser: UserProfile;
  onClose: () => void;
  onSelectUser: (userId: string) => void;
  onToggleFollow: (userId: string) => void;
}

export const UserListModal: React.FC<UserListModalProps> = ({
  title,
  users,
  currentUser,
  onClose,
  onSelectUser,
  onToggleFollow,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-zinc-200 overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
          <h3 className="font-bold text-base text-zinc-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="p-3 overflow-y-auto flex-1 space-y-1">
          {users.length === 0 ? (
            <div className="text-center py-10 text-zinc-400 text-sm">
              No users found.
            </div>
          ) : (
            users.map((user) => {
              const isSelf = user.id === currentUser.id;
              return (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-2.5 hover:bg-zinc-50 rounded-xl transition-colors group"
                >
                  <button
                    onClick={() => onSelectUser(user.id)}
                    className="flex items-center gap-3 text-left flex-1 min-w-0"
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover border border-zinc-200 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-xs text-zinc-900 truncate">
                        {user.name}
                      </div>
                      <div className="text-[11px] text-zinc-400 truncate">
                        @{user.username}
                      </div>
                      {user.bio && (
                        <div className="text-[11px] text-zinc-500 truncate mt-0.5">
                          {user.bio}
                        </div>
                      )}
                    </div>
                  </button>

                  {!isSelf && (
                    <button
                      onClick={() => onToggleFollow(user.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors shrink-0 ${
                        user.isFollowing
                          ? 'bg-zinc-100 text-zinc-700 hover:bg-rose-50 hover:text-rose-600'
                          : 'bg-sky-600 hover:bg-sky-700 text-white'
                      }`}
                    >
                      {user.isFollowing ? (
                        <>
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Following</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>Follow</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};
