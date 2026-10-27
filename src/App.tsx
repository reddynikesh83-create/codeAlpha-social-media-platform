import React, { useEffect, useState, useCallback } from 'react';
import { UserProfile, SocialPost, BackendHealth, ReactionType } from './types';
import { api } from './api';
import { Navbar } from './components/Navbar';
import { LeftSidebar } from './components/LeftSidebar';
import { RightSidebar } from './components/RightSidebar';
import { CreatePostCard } from './components/CreatePostCard';
import { PostCard } from './components/PostCard';
import { MyNetworkView } from './components/MyNetworkView';
import { JobsView } from './components/JobsView';
import { UserProfileModal } from './components/UserProfileModal';
import { EditProfileModal } from './components/EditProfileModal';
import { UserListModal } from './components/UserListModal';
import { CreateUserModal } from './components/CreateUserModal';
import { ApiInspectorModal } from './components/ApiInspectorModal';
import { 
  Bell, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Filter, 
  Download,
  Share2,
  ThumbsUp,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [backendHealth, setBackendHealth] = useState<BackendHealth | null>(null);

  // Navigation tabs: 'home' | 'network' | 'jobs' | 'notifications'
  const [currentTab, setCurrentTab] = useState<'home' | 'network' | 'jobs' | 'notifications'>('home');
  const [activeFeed, setActiveFeed] = useState<'all' | 'following' | 'bookmarks'>('all');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [activeProfileUserId, setActiveProfileUserId] = useState<string | null>(null);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [showApiInspector, setShowApiInspector] = useState(false);

  // User list modal (connections / followers)
  const [userListModalData, setUserListModalData] = useState<{
    isOpen: boolean;
    title: string;
    users: UserProfile[];
  }>({
    isOpen: false,
    title: '',
    users: [],
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Download project ZIP
  const handleDownloadZip = () => {
    showToast('Starting CodeAlpha_Task2_SocialMediaPlatform.zip download...');
    const link = document.createElement('a');
    link.href = api.getDownloadZipUrl();
    link.setAttribute('download', 'CodeAlpha_Task2_SocialMediaPlatform.zip');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 1. Initial data loading
  const loadInitialData = async () => {
    try {
      setErrorNotice(null);
      const [healthData, sessionData, usersData] = await Promise.all([
        api.getHealth(),
        api.getSession(),
        api.getUsers(),
      ]);
      setBackendHealth(healthData);
      setCurrentUser(sessionData.currentUser);
      setAllUsers(usersData);
    } catch (err: any) {
      console.error('Failed to load initial data:', err);
      setErrorNotice('Express backend connecting on Port 3000...');
    }
  };

  // 2. Fetch posts whenever feed, tag, or search changes
  const fetchPosts = useCallback(async () => {
    try {
      setLoadingPosts(true);
      const fetched = await api.getPosts({
        feed: activeFeed,
        tag: selectedTag || undefined,
        q: searchQuery || undefined,
      });
      setPosts(fetched);
    } catch (err: any) {
      console.error('Failed to fetch posts:', err);
    } finally {
      setLoadingPosts(false);
    }
  }, [activeFeed, selectedTag, searchQuery]);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Handle switching active user session
  const handleSwitchUser = async (userId: string) => {
    try {
      const res = await api.switchSession(userId);
      setCurrentUser(res.currentUser);
      const updatedUsers = await api.getUsers();
      setAllUsers(updatedUsers);
      fetchPosts();
      showToast(`Switched active profile to ${res.currentUser.name}`);
    } catch (err: any) {
      showToast(`Failed to switch user: ${err.message}`);
    }
  };

  // Handle Connect toggle
  const handleToggleConnect = async (targetUserId: string) => {
    try {
      const res = await api.toggleConnect(targetUserId);
      setCurrentUser(res.currentUser);
      setAllUsers((prev) =>
        prev.map((u) => (u.id === targetUserId ? res.targetUser : u.id === res.currentUser.id ? res.currentUser : u))
      );
      fetchPosts();
      showToast(res.isConnected ? `Connected with ${res.targetUser.name}` : `Removed connection with ${res.targetUser.name}`);
    } catch (err: any) {
      showToast(`Action failed: ${err.message}`);
    }
  };

  // Handle Follow toggle
  const handleToggleFollow = async (targetUserId: string) => {
    try {
      const res = await api.toggleFollow(targetUserId);
      setCurrentUser(res.currentUser);
      setAllUsers((prev) =>
        prev.map((u) => (u.id === targetUserId ? res.targetUser : u.id === res.currentUser.id ? res.currentUser : u))
      );
      fetchPosts();
      showToast(res.isFollowing ? `Following ${res.targetUser.name}` : `Unfollowed ${res.targetUser.name}`);
    } catch (err: any) {
      showToast(`Action failed: ${err.message}`);
    }
  };

  // Handle creating post
  const handleCreatePost = async (content: string, mediaUrl?: string, tags?: string[]) => {
    try {
      const newPost = await api.createPost({ content, mediaUrl, tags });
      setPosts((prev) => [newPost, ...prev]);
      showToast('Post shared with your network!');
      api.getHealth().then(setBackendHealth).catch(() => {});
    } catch (err: any) {
      showToast(`Failed to post: ${err.message}`);
    }
  };

  // Handle deleting post
  const handleDeletePost = async (postId: string) => {
    try {
      await api.deletePost(postId);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      showToast('Post deleted');
      api.getHealth().then(setBackendHealth).catch(() => {});
    } catch (err: any) {
      showToast(`Failed to delete: ${err.message}`);
    }
  };

  // Handle reaction to post
  const handleReactPost = async (postId: string, type: ReactionType) => {
    if (!currentUser) return;
    try {
      const updatedPost = await api.reactToPost(postId, type);
      setPosts((prev) => prev.map((p) => (p.id === postId ? updatedPost : p)));
    } catch (err) {
      fetchPosts();
    }
  };

  // Handle repost
  const handleRepost = async (postId: string) => {
    try {
      const res = await api.toggleRepost(postId);
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, isReposted: res.isReposted, repostCount: res.count }
            : p
        )
      );
      showToast(posts.find(p => p.id === postId)?.isReposted ? 'Repost removed' : 'Reposted to your network!');
    } catch (err) {
      fetchPosts();
    }
  };

  // Handle bookmark
  const handleBookmarkPost = async (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, isBookmarked: !p.isBookmarked } : p))
    );
    try {
      const res = await api.toggleBookmarkPost(postId);
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, isBookmarked: res.isBookmarked } : p))
      );
      showToast(posts.find(p => p.id === postId)?.isBookmarked ? 'Removed from saved items' : 'Saved to your items');
    } catch (err) {
      fetchPosts();
    }
  };

  // Handle adding comment
  const handleAddComment = async (postId: string, content: string) => {
    try {
      const comment = await api.addComment(postId, content);
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id === postId) {
            return {
              ...p,
              commentCount: p.commentCount + 1,
              comments: [...p.comments, comment],
            };
          }
          return p;
        })
      );
      showToast('Comment posted!');
      api.getHealth().then(setBackendHealth).catch(() => {});
    } catch (err: any) {
      showToast(`Failed to post comment: ${err.message}`);
    }
  };

  // Handle deleting comment
  const handleDeleteComment = async (commentId: string) => {
    try {
      await api.deleteComment(commentId);
      setPosts((prev) =>
        prev.map((p) => ({
          ...p,
          comments: p.comments.filter((c) => c.id !== commentId),
          commentCount: p.comments.some((c) => c.id === commentId) ? p.commentCount - 1 : p.commentCount,
        }))
      );
      showToast('Comment deleted');
    } catch (err: any) {
      showToast(`Failed to delete comment: ${err.message}`);
    }
  };

  // Handle saving profile edit
  const handleSaveProfile = async (updatedData: Partial<UserProfile>) => {
    if (!currentUser) return;
    try {
      const updated = await api.updateProfile(currentUser.id, updatedData);
      setCurrentUser(updated);
      setAllUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
      fetchPosts();
      showToast('Profile updated successfully!');
    } catch (err: any) {
      showToast(`Failed to update profile: ${err.message}`);
    }
  };

  // Handle registering new user
  const handleCreateUser = async (userData: any) => {
    try {
      const newUser = await api.createUser(userData);
      setCurrentUser(newUser);
      const updatedUsers = await api.getUsers();
      setAllUsers(updatedUsers);
      fetchPosts();
      showToast(`Welcome ${newUser.name}! Profile created.`);
    } catch (err: any) {
      throw err;
    }
  };

  // Handle resetting demo data
  const handleResetDemo = async () => {
    try {
      await api.resetDemo();
      await loadInitialData();
      await fetchPosts();
      showToast('Demo data reset to initial state!');
    } catch (err: any) {
      showToast(`Reset failed: ${err.message}`);
    }
  };

  // Open connections list modal
  const handleOpenConnectionsModal = async () => {
    if (!currentUser) return;
    try {
      const data = await api.getUserProfile(currentUser.id);
      setUserListModalData({
        isOpen: true,
        title: `Your 1st Degree Connections (${data.connections.length})`,
        users: data.connections,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f2ee] text-zinc-900 font-sans antialiased flex flex-col">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-zinc-900 text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 border border-zinc-700 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* LinkedIn Global Top Navigation Bar */}
      <Navbar
        currentUser={currentUser}
        allUsers={allUsers}
        backendHealth={backendHealth}
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onSwitchUser={handleSwitchUser}
        onOpenCreateUser={() => setShowCreateUser(true)}
        onOpenProfile={(id) => setActiveProfileUserId(id)}
        onOpenApiInspector={() => setShowApiInspector(true)}
        onResetDemo={handleResetDemo}
        onDownloadZip={handleDownloadZip}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Page Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-5 flex-1 w-full">
        
        {/* Error notification if server is initializing */}
        {errorNotice && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>{errorNotice}</span>
            </div>
            <button
              onClick={loadInitialData}
              className="px-3 py-1 bg-amber-200 hover:bg-amber-300 rounded-md font-bold text-amber-900 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* TAB 1: HOME FEED (3-COLUMN CLASSIC LINKEDIN LAYOUT) */}
        {currentTab === 'home' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5">
            
            {/* Left Column: User Profile Summary & Followed Topics */}
            <aside className="md:col-span-3">
              {currentUser && (
                <LeftSidebar
                  currentUser={currentUser}
                  activeFeed={activeFeed}
                  selectedTag={selectedTag}
                  onSelectFeed={setActiveFeed}
                  onSelectTag={setSelectedTag}
                  onOpenProfile={(id) => setActiveProfileUserId(id)}
                  onOpenConnections={handleOpenConnectionsModal}
                />
              )}
            </aside>

            {/* Center Column: Start a Post + Feed Posts */}
            <main className="md:col-span-6">
              
              {/* LinkedIn "Start a post" Card */}
              {currentUser && (
                <CreatePostCard
                  currentUser={currentUser}
                  onSubmitPost={handleCreatePost}
                />
              )}

              {/* Feed Divider & Sorter */}
              <div className="flex items-center gap-3 my-2 px-1">
                <div className="h-[1px] bg-zinc-300 flex-1" />
                <div className="text-[11px] font-semibold text-zinc-500 flex items-center gap-1.5">
                  <span>Sort by:</span>
                  <span className="font-bold text-zinc-800">Top Updates</span>
                  <span className="text-zinc-400">({posts.length} posts)</span>
                </div>
                <button
                  onClick={fetchPosts}
                  disabled={loadingPosts}
                  className="text-zinc-500 hover:text-zinc-800 p-1"
                  title="Refresh posts"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingPosts ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {/* Active Filter Pill */}
              {selectedTag && (
                <div className="mb-3 p-2 bg-white rounded-lg border border-zinc-200 text-xs flex items-center justify-between text-zinc-700">
                  <span className="font-semibold text-[#0a66c2]">
                    Filtering posts with #{selectedTag}
                  </span>
                  <button
                    onClick={() => setSelectedTag('')}
                    className="text-xs text-zinc-400 hover:text-zinc-700"
                  >
                    Clear Filter
                  </button>
                </div>
              )}

              {/* Posts List */}
              {loadingPosts && posts.length === 0 ? (
                <div className="space-y-3">
                  {[1, 2].map((n) => (
                    <div key={n} className="bg-white rounded-xl border border-zinc-200 p-4 space-y-3 animate-pulse">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-zinc-200" />
                        <div className="space-y-1.5 flex-1">
                          <div className="h-3 bg-zinc-200 rounded w-32" />
                          <div className="h-2.5 bg-zinc-100 rounded w-48" />
                        </div>
                      </div>
                      <div className="h-4 bg-zinc-200 rounded w-full" />
                      <div className="h-4 bg-zinc-100 rounded w-3/4" />
                    </div>
                  ))}
                </div>
              ) : posts.length === 0 ? (
                <div className="bg-white rounded-xl border border-zinc-200 p-10 text-center text-zinc-500">
                  <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-2 text-zinc-400">
                    <Filter className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-zinc-900 text-sm mb-1">No updates in this feed</h3>
                  <p className="text-xs text-zinc-400 max-w-sm mx-auto mb-4">
                    {activeFeed === 'following'
                      ? 'You are not following anyone with posts yet. Try connecting with members on the right!'
                      : activeFeed === 'bookmarks'
                      ? 'No items saved yet. Click the 3-dot menu or bookmark icon on any post to save it.'
                      : 'Share a project update or coding insight with your network above!'}
                  </p>
                  {activeFeed !== 'all' && (
                    <button
                      onClick={() => setActiveFeed('all')}
                      className="px-4 py-1.5 bg-[#0a66c2] text-white rounded-full text-xs font-semibold"
                    >
                      View All Posts
                    </button>
                  )}
                </div>
              ) : (
                posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    currentUser={currentUser || post.author as any}
                    onReact={handleReactPost}
                    onRepost={handleRepost}
                    onBookmark={handleBookmarkPost}
                    onDelete={handleDeletePost}
                    onFollowAuthor={handleToggleFollow}
                    onConnectAuthor={handleToggleConnect}
                    onOpenProfile={(authorId) => setActiveProfileUserId(authorId)}
                    onSelectTag={(tag) => setSelectedTag(tag)}
                    onAddComment={handleAddComment}
                    onDeleteComment={handleDeleteComment}
                  />
                ))
              )}

            </main>

            {/* Right Column: News & Export ZIP Banner */}
            <aside className="md:col-span-3">
              {currentUser && (
                <RightSidebar
                  users={allUsers}
                  currentUser={currentUser}
                  onConnect={handleToggleConnect}
                  onFollow={handleToggleFollow}
                  onSelectUser={(userId) => setActiveProfileUserId(userId)}
                  onDownloadZip={handleDownloadZip}
                />
              )}
            </aside>

          </div>
        )}

        {/* TAB 2: MY NETWORK VIEW */}
        {currentTab === 'network' && currentUser && (
          <MyNetworkView
            currentUser={currentUser}
            allUsers={allUsers}
            onConnect={handleToggleConnect}
            onFollow={handleToggleFollow}
            onSelectUser={(id) => setActiveProfileUserId(id)}
          />
        )}

        {/* TAB 3: JOBS VIEW */}
        {currentTab === 'jobs' && currentUser && (
          <JobsView currentUser={currentUser} />
        )}

        {/* TAB 4: NOTIFICATIONS VIEW */}
        {currentTab === 'notifications' && (
          <div className="max-w-2xl mx-auto bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-xs divide-y divide-zinc-100">
            <div className="p-4 bg-zinc-50 border-b border-zinc-100 flex items-center justify-between">
              <h3 className="font-bold text-sm text-zinc-900 flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#0a66c2]" />
                <span>Notifications & Activity</span>
              </h3>
              <span className="text-xs text-zinc-500">3 new alerts</span>
            </div>

            <div className="p-4 flex items-start gap-3 hover:bg-zinc-50/60 cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80"
                alt="Sarah"
                className="w-10 h-10 rounded-full object-cover shrink-0"
              />
              <div className="text-xs flex-1">
                <p className="text-zinc-800 leading-snug">
                  <strong className="text-zinc-900">Sarah Miller</strong> and 3 others reacted to your update: "Excited to share that I have just completed Task 2 for CodeAlpha..."
                </p>
                <span className="text-[10px] text-zinc-400 mt-1 block">25 minutes ago</span>
              </div>
            </div>

            <div className="p-4 flex items-start gap-3 hover:bg-zinc-50/60 cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80"
                alt="Marcus"
                className="w-10 h-10 rounded-full object-cover shrink-0"
              />
              <div className="text-xs flex-1">
                <p className="text-zinc-800 leading-snug">
                  <strong className="text-zinc-900">Marcus Vance</strong> commented on your post: "Clean REST endpoints with proper HTTP status codes make frontend integration a breeze."
                </p>
                <span className="text-[10px] text-zinc-400 mt-1 block">1 hour ago</span>
              </div>
            </div>

            <div className="p-4 flex items-start gap-3 hover:bg-zinc-50/60 cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80"
                alt="David"
                className="w-10 h-10 rounded-full object-cover shrink-0"
              />
              <div className="text-xs flex-1">
                <p className="text-zinc-800 leading-snug">
                  <strong className="text-zinc-900">David Kim</strong> viewed your profile and sent a connection invitation.
                </p>
                <span className="text-[10px] text-zinc-400 mt-1 block">3 hours ago</span>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* --- Modals --- */}

      {/* User Profile Modal */}
      {activeProfileUserId && currentUser && (
        <UserProfileModal
          userId={activeProfileUserId}
          currentUser={currentUser}
          onClose={() => setActiveProfileUserId(null)}
          onOpenEditProfile={() => setShowEditProfile(true)}
          onPostUpdated={fetchPosts}
        />
      )}

      {/* Edit Profile Modal */}
      {showEditProfile && currentUser && (
        <EditProfileModal
          currentUser={currentUser}
          onClose={() => setShowEditProfile(false)}
          onSave={handleSaveProfile}
        />
      )}

      {/* User List Modal */}
      {userListModalData.isOpen && currentUser && (
        <UserListModal
          title={userListModalData.title}
          users={userListModalData.users}
          currentUser={currentUser}
          onClose={() => setUserListModalData({ isOpen: false, title: '', users: [] })}
          onSelectUser={(id) => {
            setUserListModalData({ isOpen: false, title: '', users: [] });
            setActiveProfileUserId(id);
          }}
          onToggleFollow={handleToggleFollow}
        />
      )}

      {/* Create User Profile Modal */}
      {showCreateUser && (
        <CreateUserModal
          onClose={() => setShowCreateUser(false)}
          onCreateUser={handleCreateUser}
        />
      )}

      {/* Express.js REST API Inspector Modal */}
      {showApiInspector && (
        <ApiInspectorModal
          health={backendHealth}
          onClose={() => setShowApiInspector(false)}
          onRefreshHealth={async () => {
            const h = await api.getHealth();
            setBackendHealth(h);
            showToast('API ping successful: Express.js active');
          }}
        />
      )}

    </div>
  );
}
