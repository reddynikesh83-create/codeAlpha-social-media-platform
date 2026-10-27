import React, { useState } from 'react';
import { SocialPost, UserProfile, PostComment, ReactionType } from '../types';
import { formatTimeAgo } from '../utils';
import { 
  ThumbsUp, 
  MessageSquare, 
  Repeat2, 
  Send, 
  Bookmark, 
  MoreHorizontal, 
  Trash2, 
  Check, 
  Share2, 
  Sparkles,
  UserPlus,
  UserCheck
} from 'lucide-react';

interface PostCardProps {
  post: SocialPost;
  currentUser: UserProfile;
  onReact: (postId: string, type: ReactionType) => void;
  onRepost: (postId: string) => void;
  onBookmark: (postId: string) => void;
  onDelete: (postId: string) => void;
  onFollowAuthor: (authorId: string) => void;
  onConnectAuthor: (authorId: string) => void;
  onOpenProfile: (authorId: string) => void;
  onSelectTag: (tag: string) => void;
  onAddComment: (postId: string, content: string) => Promise<void>;
  onDeleteComment: (commentId: string) => void;
}

const REACTION_CONFIG: Record<ReactionType, { label: string; icon: string; color: string }> = {
  like: { label: 'Like', icon: '👍', color: 'text-[#0a66c2]' },
  celebrate: { label: 'Celebrate', icon: '👏', color: 'text-emerald-600' },
  support: { label: 'Support', icon: '🤝', color: 'text-purple-600' },
  love: { label: 'Love', icon: '❤️', color: 'text-rose-600' },
  insightful: { label: 'Insightful', icon: '💡', color: 'text-amber-600' },
};

export const PostCard: React.FC<PostCardProps> = ({
  post,
  currentUser,
  onReact,
  onRepost,
  onBookmark,
  onDelete,
  onFollowAuthor,
  onConnectAuthor,
  onOpenProfile,
  onSelectTag,
  onAddComment,
  onDeleteComment,
}) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [reactionPickerOpen, setReactionPickerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const isAuthor = currentUser.id === post.authorId;
  const currentReaction = post.userReaction ? REACTION_CONFIG[post.userReaction] : null;

  const handleShare = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmittingComment) return;

    setIsSubmittingComment(true);
    try {
      await onAddComment(post.id, newComment.trim());
      setNewComment('');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const renderContentWithHashtags = (text: string) => {
    const parts = text.split(/(#[a-zA-Z0-9_]+)/g);
    return parts.map((part, index) => {
      if (part.startsWith('#')) {
        const cleanTag = part.substring(1);
        return (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              onSelectTag(cleanTag);
            }}
            className="text-[#0a66c2] hover:underline font-semibold inline-block mr-0.5"
          >
            {part}
          </button>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <article className="bg-white rounded-xl border border-zinc-200 shadow-xs mb-3 hover:border-zinc-300 transition-colors">
      
      {/* Top Header: Author details & Connect/Follow */}
      <div className="p-3 sm:p-4 pb-2">
        <div className="flex items-start justify-between gap-3">
          
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <button
              onClick={() => onOpenProfile(post.author.id)}
              className="relative shrink-0 text-left group"
            >
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-12 h-12 rounded-full object-cover border border-zinc-200 group-hover:brightness-95 transition-all"
              />
            </button>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => onOpenProfile(post.author.id)}
                  className="font-bold text-sm text-zinc-900 hover:text-[#0a66c2] hover:underline transition-colors text-left truncate"
                >
                  {post.author.name}
                </button>
                <span className="text-[11px] text-zinc-400 font-medium">· 1st</span>
              </div>

              {post.author.headline && (
                <p className="text-[11px] text-zinc-500 line-clamp-1 leading-snug">
                  {post.author.headline}
                </p>
              )}

              <div className="flex items-center gap-1 text-[11px] text-zinc-400 mt-0.5">
                <span>{formatTimeAgo(post.createdAt)}</span>
                <span>·</span>
                <span>🌐</span>
              </div>
            </div>
          </div>

          {/* Right Header: Connect button & 3-dot menu */}
          <div className="flex items-center gap-1.5 shrink-0">
            {!isAuthor && (
              <button
                onClick={() => onFollowAuthor(post.author.id)}
                className="flex items-center gap-1 text-xs font-semibold text-[#0a66c2] hover:bg-sky-50 px-2.5 py-1 rounded-full border border-transparent hover:border-sky-200 transition-colors"
                title="Follow creator"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Follow</span>
              </button>
            )}

            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-1.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-full transition-colors"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>

              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-zinc-200 py-1 z-40 text-xs">
                    <button
                      onClick={() => {
                        handleShare();
                        setMenuOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-zinc-50 flex items-center gap-2 text-zinc-700"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Copy link to post</span>
                    </button>
                    <button
                      onClick={() => {
                        onBookmark(post.id);
                        setMenuOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-zinc-50 flex items-center gap-2 text-zinc-700"
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                      <span>{post.isBookmarked ? 'Remove bookmark' : 'Save post'}</span>
                    </button>
                    {isAuthor && (
                      <button
                        onClick={() => {
                          onDelete(post.id);
                          setMenuOpen(false);
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-rose-50 text-rose-600 flex items-center gap-2 border-t border-zinc-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete post</span>
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* Post Text Body */}
      <div className="px-3 sm:px-4 py-1 text-sm text-zinc-800 leading-relaxed whitespace-pre-wrap">
        {renderContentWithHashtags(post.content)}
      </div>

      {/* Attached Media */}
      {post.mediaUrl && (
        <div className="mt-2.5 overflow-hidden border-y border-zinc-100 bg-zinc-50">
          <img
            src={post.mediaUrl}
            alt="Post content"
            className="w-full max-h-[440px] object-cover"
            loading="lazy"
          />
        </div>
      )}

      {/* Engagement Stats Bar */}
      <div className="px-3 sm:px-4 py-2 flex items-center justify-between text-xs text-zinc-500 border-b border-zinc-100">
        <div className="flex items-center gap-1.5">
          <div className="flex -space-x-1">
            <span className="w-4 h-4 rounded-full bg-[#0a66c2] text-white text-[9px] flex items-center justify-center font-bold">
              👍
            </span>
            <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] flex items-center justify-center font-bold">
              👏
            </span>
            <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] flex items-center justify-center font-bold">
              💡
            </span>
          </div>
          <span className="text-zinc-600 hover:text-[#0a66c2] hover:underline cursor-pointer">
            {post.totalReactions > 0
              ? `${post.totalReactions} reactions`
              : 'Be the first to react'}
          </span>
        </div>

        <div className="flex items-center gap-2 text-zinc-400 text-[11px]">
          <button
            onClick={() => setShowComments(!showComments)}
            className="hover:text-[#0a66c2] hover:underline"
          >
            {post.commentCount} comments
          </button>
          <span>·</span>
          <span>{post.repostCount} reposts</span>
        </div>
      </div>

      {/* LinkedIn 4-Action Bar: Like / Comment / Repost / Send */}
      <div className="px-2 py-1 flex items-center justify-between relative border-b border-zinc-100 text-zinc-600">
        
        {/* Like / React Button with popup menu */}
        <div className="relative">
          <button
            onClick={() => onReact(post.id, post.userReaction ? post.userReaction : 'like')}
            onMouseEnter={() => setReactionPickerOpen(true)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg hover:bg-zinc-100 transition-colors ${
              currentReaction ? currentReaction.color : 'hover:text-zinc-900'
            }`}
          >
            {currentReaction ? (
              <>
                <span className="text-base">{currentReaction.icon}</span>
                <span>{currentReaction.label}</span>
              </>
            ) : (
              <>
                <ThumbsUp className="w-4 h-4" />
                <span>Like</span>
              </>
            )}
          </button>

          {/* LinkedIn Floating Reaction Selector */}
          {reactionPickerOpen && (
            <div
              onMouseLeave={() => setReactionPickerOpen(false)}
              className="absolute left-0 bottom-full mb-1 bg-white rounded-full shadow-xl border border-zinc-200 p-1.5 flex items-center gap-1.5 z-30 animate-in fade-in zoom-in-95 duration-150"
            >
              {(Object.keys(REACTION_CONFIG) as ReactionType[]).map((type) => {
                const config = REACTION_CONFIG[type];
                return (
                  <button
                    key={type}
                    onClick={() => {
                      onReact(post.id, type);
                      setReactionPickerOpen(false);
                    }}
                    className="p-1 hover:scale-125 transition-transform text-lg"
                    title={config.label}
                  >
                    {config.icon}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Comment */}
        <button
          onClick={() => setShowComments(!showComments)}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg hover:bg-zinc-100 transition-colors ${
            showComments ? 'text-[#0a66c2]' : 'hover:text-zinc-900'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Comment</span>
        </button>

        {/* Repost */}
        <button
          onClick={() => onRepost(post.id)}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg hover:bg-zinc-100 transition-colors ${
            post.isReposted ? 'text-emerald-600' : 'hover:text-zinc-900'
          }`}
          title="Repost to your network"
        >
          <Repeat2 className="w-4 h-4" />
          <span>Repost</span>
        </button>

        {/* Send / Save */}
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
          title="Share or copy post link"
        >
          {copiedLink ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-600">Copied</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Send</span>
            </>
          )}
        </button>

      </div>

      {/* Expanded Comments Section */}
      {showComments && (
        <div className="p-3 sm:p-4 bg-[#f8f9fa] rounded-b-xl space-y-3">
          
          {/* Add Comment input */}
          <form onSubmit={handleCommentSubmit} className="flex gap-2.5">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover border border-zinc-200 shrink-0"
            />
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                placeholder="Add a comment or thought..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 text-xs px-3.5 py-2 bg-white border border-zinc-300 rounded-full focus:outline-none focus:border-[#0a66c2] text-zinc-900"
              />
              <button
                type="submit"
                disabled={!newComment.trim() || isSubmittingComment}
                className="px-4 py-1.5 bg-[#0a66c2] hover:bg-[#004182] disabled:opacity-40 text-white rounded-full text-xs font-bold transition-colors"
              >
                Post
              </button>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-2.5 pt-1">
            {post.comments.length === 0 ? (
              <p className="text-xs text-zinc-400 py-2 text-center">
                No comments yet. Be the first to share your perspective!
              </p>
            ) : (
              post.comments.map((comment: PostComment) => (
                <div key={comment.id} className="flex items-start gap-2.5 group">
                  <img
                    src={comment.author.avatar}
                    alt={comment.author.name}
                    className="w-7 h-7 rounded-full object-cover border border-zinc-200 shrink-0 mt-1"
                  />
                  <div className="flex-1 bg-white p-3 rounded-2xl border border-zinc-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-xs text-zinc-900">
                          {comment.author.name}
                        </span>
                        <div className="text-[10px] text-zinc-400">
                          {comment.author.headline || '@' + comment.author.username}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-zinc-400">
                          {formatTimeAgo(comment.createdAt)}
                        </span>
                        {currentUser.id === comment.authorId && (
                          <button
                            onClick={() => onDeleteComment(comment.id)}
                            className="text-zinc-400 hover:text-rose-600 transition-colors"
                            title="Delete comment"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-zinc-700 mt-1.5 leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      )}

    </article>
  );
};
