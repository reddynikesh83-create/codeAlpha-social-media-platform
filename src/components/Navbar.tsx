import React, { useState } from 'react';
import { UserProfile, BackendHealth } from '../types';
import { 
  Home, 
  Users, 
  Briefcase, 
  MessageSquare, 
  Bell, 
  Search, 
  ChevronDown, 
  Download, 
  Code2, 
  UserPlus, 
  RefreshCw,
  ExternalLink,
  Check
} from 'lucide-react';

interface NavbarProps {
  currentUser: UserProfile | null;
  allUsers: UserProfile[];
  backendHealth: BackendHealth | null;
  currentTab: 'home' | 'network' | 'jobs' | 'notifications';
  onSelectTab: (tab: 'home' | 'network' | 'jobs' | 'notifications') => void;
  onSwitchUser: (userId: string) => void;
  onOpenCreateUser: () => void;
  onOpenProfile: (userId: string) => void;
  onOpenApiInspector: () => void;
  onResetDemo: () => void;
  onDownloadZip: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  allUsers,
  backendHealth,
  currentTab,
  onSelectTab,
  onSwitchUser,
  onOpenCreateUser,
  onOpenProfile,
  onOpenApiInspector,
  onResetDemo,
  onDownloadZip,
  searchQuery,
  onSearchChange,
}) => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadClick = () => {
    onDownloadZip();
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 gap-2 sm:gap-4">
          
          {/* Left: Brand Icon + Search */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-sm sm:max-w-md">
            {/* Signature LinkedIn logo icon */}
            <div 
              onClick={() => onSelectTab('home')}
              className="cursor-pointer flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 bg-[#0a66c2] text-white rounded font-bold text-lg sm:text-xl font-sans tracking-tight shrink-0 shadow-xs hover:opacity-95 transition-opacity"
              title="LinkedIn ProConnect — CodeAlpha Task 2"
            >
              in
            </div>

            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search jobs, skills, or people..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-[#edf3f8] border border-transparent rounded-md focus:bg-white focus:border-zinc-300 focus:outline-none transition-all placeholder:text-zinc-500 text-zinc-900"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-600"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Center: Main Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-3 md:gap-5">
            
            {/* Home */}
            <button
              onClick={() => onSelectTab('home')}
              className={`flex flex-col items-center justify-center min-w-[48px] sm:min-w-[56px] py-1 text-[11px] font-normal transition-colors relative ${
                currentTab === 'home'
                  ? 'text-zinc-900 font-semibold'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              <Home className={`w-5 h-5 ${currentTab === 'home' ? 'text-zinc-900' : 'text-zinc-500'}`} />
              <span className="hidden sm:inline mt-0.5">Home</span>
              {currentTab === 'home' && (
                <span className="absolute bottom-[-9px] left-0 right-0 h-[2px] bg-zinc-900" />
              )}
            </button>

            {/* My Network */}
            <button
              onClick={() => onSelectTab('network')}
              className={`flex flex-col items-center justify-center min-w-[48px] sm:min-w-[56px] py-1 text-[11px] font-normal transition-colors relative ${
                currentTab === 'network'
                  ? 'text-zinc-900 font-semibold'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              <div className="relative">
                <Users className={`w-5 h-5 ${currentTab === 'network' ? 'text-zinc-900' : 'text-zinc-500'}`} />
                <span className="absolute -top-1 -right-2 bg-[#0a66c2] text-white text-[9px] font-bold px-1 rounded-full">
                  {allUsers.length}
                </span>
              </div>
              <span className="hidden sm:inline mt-0.5">My Network</span>
              {currentTab === 'network' && (
                <span className="absolute bottom-[-9px] left-0 right-0 h-[2px] bg-zinc-900" />
              )}
            </button>

            {/* Jobs */}
            <button
              onClick={() => onSelectTab('jobs')}
              className={`flex flex-col items-center justify-center min-w-[48px] sm:min-w-[56px] py-1 text-[11px] font-normal transition-colors relative ${
                currentTab === 'jobs'
                  ? 'text-zinc-900 font-semibold'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              <Briefcase className={`w-5 h-5 ${currentTab === 'jobs' ? 'text-zinc-900' : 'text-zinc-500'}`} />
              <span className="hidden sm:inline mt-0.5">Jobs</span>
              {currentTab === 'jobs' && (
                <span className="absolute bottom-[-9px] left-0 right-0 h-[2px] bg-zinc-900" />
              )}
            </button>

            {/* Notifications */}
            <button
              onClick={() => onSelectTab('notifications')}
              className={`flex flex-col items-center justify-center min-w-[48px] sm:min-w-[56px] py-1 text-[11px] font-normal transition-colors relative ${
                currentTab === 'notifications'
                  ? 'text-zinc-900 font-semibold'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              <div className="relative">
                <Bell className={`w-5 h-5 ${currentTab === 'notifications' ? 'text-zinc-900' : 'text-zinc-500'}`} />
                <span className="absolute -top-1 -right-1.5 bg-rose-600 text-white text-[9px] font-bold px-1 rounded-full">
                  3
                </span>
              </div>
              <span className="hidden sm:inline mt-0.5">Notifications</span>
              {currentTab === 'notifications' && (
                <span className="absolute bottom-[-9px] left-0 right-0 h-[2px] bg-zinc-900" />
              )}
            </button>

            {/* Me dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex flex-col items-center justify-center min-w-[48px] sm:min-w-[56px] py-1 text-[11px] text-zinc-500 hover:text-zinc-900 transition-colors"
              >
                {currentUser ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-5 h-5 rounded-full object-cover border border-zinc-300"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-zinc-200" />
                )}
                <div className="hidden sm:flex items-center gap-0.5 mt-0.5">
                  <span>Me</span>
                  <ChevronDown className="w-3 h-3 text-zinc-400" />
                </div>
              </button>

              {userDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setUserDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-zinc-200 p-2 z-50 text-xs">
                    {currentUser && (
                      <div className="p-3 border-b border-zinc-100 flex items-center gap-3">
                        <img
                          src={currentUser.avatar}
                          alt={currentUser.name}
                          className="w-12 h-12 rounded-full object-cover border border-zinc-200"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-zinc-900 text-sm truncate">{currentUser.name}</div>
                          <div className="text-zinc-500 line-clamp-1">{currentUser.headline}</div>
                          <button
                            onClick={() => {
                              onOpenProfile(currentUser.id);
                              setUserDropdownOpen(false);
                            }}
                            className="mt-2 w-full py-1 text-center text-[#0a66c2] border border-[#0a66c2] rounded-full font-semibold hover:bg-sky-50 transition-colors"
                          >
                            View Profile
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="p-2 border-b border-zinc-100">
                      <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider px-2 mb-1">
                        Switch Account (Multi-user Demo)
                      </div>
                      <div className="max-h-44 overflow-y-auto space-y-1">
                        {allUsers.map((user) => (
                          <button
                            key={user.id}
                            onClick={() => {
                              onSwitchUser(user.id);
                              setUserDropdownOpen(false);
                            }}
                            className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-colors ${
                              currentUser?.id === user.id
                                ? 'bg-sky-50 text-sky-900 font-semibold'
                                : 'hover:bg-zinc-100 text-zinc-700'
                            }`}
                          >
                            <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full object-cover" />
                            <div className="min-w-0 flex-1">
                              <div className="truncate text-xs">{user.name}</div>
                              <div className="truncate text-[10px] text-zinc-400">@{user.username}</div>
                            </div>
                            {currentUser?.id === user.id && (
                              <span className="text-[9px] bg-sky-200 text-sky-800 px-1.5 py-0.5 rounded font-medium">
                                Active
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-1.5 space-y-1">
                      <button
                        onClick={() => {
                          onOpenCreateUser();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 text-zinc-700 hover:bg-zinc-100 rounded-lg text-left"
                      >
                        <UserPlus className="w-3.5 h-3.5 text-zinc-500" />
                        <span>Create New User Profile</span>
                      </button>
                      <button
                        onClick={() => {
                          onResetDemo();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 text-zinc-500 hover:bg-zinc-100 rounded-lg text-left"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Reset Seed Data</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Vertical Separator */}
            <div className="h-7 w-[1px] bg-zinc-200 hidden md:block" />

            {/* Download Project ZIP Button */}
            <button
              onClick={handleDownloadClick}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-xs transition-all ${
                downloadSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#0a66c2] hover:bg-[#004182] text-white'
              }`}
              title="Download CodeAlpha_Task2_SocialMediaPlatform.zip for GitHub submission"
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Downloading ZIP...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Download ZIP</span>
                </>
              )}
            </button>

            {/* REST API Explorer */}
            <button
              onClick={onOpenApiInspector}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-zinc-700 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200 rounded-full transition-colors"
              title="Inspect Express.js REST APIs on Port 3000"
            >
              <Code2 className="w-3.5 h-3.5 text-zinc-600" />
              <span>Express API</span>
            </button>

          </nav>

        </div>
      </div>
    </header>
  );
};
