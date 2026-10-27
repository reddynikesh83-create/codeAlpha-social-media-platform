import React, { useState } from 'react';
import { UserProfile } from '../types';
import { 
  Image as ImageIcon, 
  Video, 
  Calendar, 
  FileText, 
  X, 
  Globe, 
  Hash, 
  Sparkles,
  Send
} from 'lucide-react';

interface CreatePostCardProps {
  currentUser: UserProfile;
  onSubmitPost: (content: string, mediaUrl?: string, tags?: string[]) => Promise<void>;
}

const PRESET_IMAGES = [
  { label: 'Code Snippet', url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Design System', url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Tech Workspace', url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Team Collaboration', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80' },
];

const SUGGESTED_TAGS = ['fullstack', 'react', 'express', 'webdev', 'codealpha', 'internship', 'techjobs'];

export const CreatePostCard: React.FC<CreatePostCardProps> = ({ currentUser, onSubmitPost }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmitPost(content.trim(), mediaUrl.trim() || undefined, selectedTags);
      setContent('');
      setMediaUrl('');
      setSelectedTags([]);
      setModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* LinkedIn "Start a post" Feed Card */}
      <div className="bg-white rounded-xl border border-zinc-200 p-3 sm:p-4 shadow-xs mb-3">
        <div className="flex items-center gap-3 mb-2.5">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-11 h-11 rounded-full object-cover border border-zinc-200 shrink-0"
          />
          <button
            onClick={() => setModalOpen(true)}
            className="flex-1 text-left px-4 py-3 bg-[#f3f2ef] hover:bg-[#ebe7df] text-zinc-600 text-xs sm:text-sm font-semibold rounded-full border border-zinc-200 transition-colors"
          >
            Start a post, try writing with AI or share an update...
          </button>
        </div>

        {/* 4 Iconic LinkedIn Action Buttons */}
        <div className="flex items-center justify-between pt-1 border-t border-zinc-100 flex-wrap gap-1">
          <button
            onClick={() => {
              setModalOpen(true);
            }}
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors"
          >
            <ImageIcon className="w-4 h-4 text-[#378fe9]" />
            <span className="hidden sm:inline">Media</span>
          </button>

          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors"
          >
            <Video className="w-4 h-4 text-[#5f9b41]" />
            <span className="hidden sm:inline">Video</span>
          </button>

          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors"
          >
            <Calendar className="w-4 h-4 text-[#c37d16]" />
            <span className="hidden sm:inline">Event</span>
          </button>

          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors"
          >
            <FileText className="w-4 h-4 text-[#e06847]" />
            <span className="hidden sm:inline">Write article</span>
          </button>
        </div>
      </div>

      {/* Full LinkedIn Create Post Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-zinc-200 overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="px-5 py-3.5 border-b border-zinc-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-full object-cover border border-zinc-200"
                />
                <div>
                  <div className="font-bold text-sm text-zinc-900 leading-tight">
                    {currentUser.name}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-zinc-500 font-medium mt-0.5">
                    <Globe className="w-3 h-3 text-zinc-400" />
                    <span>Post to Anyone</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-full text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content body */}
            <form onSubmit={handleSubmit} className="p-5 flex-1 flex flex-col overflow-y-auto">
              <textarea
                rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What do you want to talk about? Share an insight, project milestone, or engineering tip..."
                className="w-full text-sm text-zinc-900 placeholder:text-zinc-400 bg-transparent resize-none border-0 focus:ring-0 focus:outline-none p-0 leading-relaxed mb-3 flex-1 min-h-[120px]"
                autoFocus
              />

              {/* Media Preview if specified */}
              {mediaUrl && (
                <div className="relative mb-3 rounded-xl overflow-hidden border border-zinc-200 group max-h-56">
                  <img src={mediaUrl} alt="Preview" className="w-full h-44 object-cover" />
                  <button
                    type="button"
                    onClick={() => setMediaUrl('')}
                    className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Media URL Input and presets */}
              <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-200 mb-3 space-y-2">
                <div className="text-xs font-semibold text-zinc-700 flex items-center justify-between">
                  <span>Attach Image or Project Preview</span>
                </div>
                <input
                  type="url"
                  placeholder="Paste image URL (https://...)"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  className="w-full text-xs px-3 py-1.5 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-sky-500"
                />
                <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                  <span className="text-[11px] text-zinc-400">Presets:</span>
                  {PRESET_IMAGES.map((preset) => (
                    <button
                      type="button"
                      key={preset.label}
                      onClick={() => setMediaUrl(preset.url)}
                      className="px-2 py-0.5 text-[11px] bg-white border border-zinc-200 rounded text-zinc-600 hover:border-zinc-400"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tag suggestions */}
              <div className="flex items-center gap-1.5 flex-wrap mb-4">
                <span className="text-xs text-zinc-400 flex items-center gap-1">
                  <Hash className="w-3 h-3" />
                  <span>Hashtags:</span>
                </span>
                {SUGGESTED_TAGS.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => handleToggleTag(tag)}
                      className={`text-xs px-2 py-0.5 rounded transition-colors ${
                        isSelected
                          ? 'bg-sky-100 text-[#0a66c2] font-semibold'
                          : 'text-zinc-600 hover:bg-zinc-100'
                      }`}
                    >
                      #{tag}
                    </button>
                  );
                })}
              </div>

              {/* Modal footer */}
              <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                <span className="text-xs text-zinc-400">
                  {content.length}/1000 characters
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 rounded-full"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!content.trim() || isSubmitting}
                    className="px-5 py-2 bg-[#0a66c2] hover:bg-[#004182] disabled:opacity-50 text-white rounded-full text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Posting...' : 'Post'}</span>
                  </button>
                </div>
              </div>

            </form>

          </div>
        </div>
      )}
    </>
  );
};
