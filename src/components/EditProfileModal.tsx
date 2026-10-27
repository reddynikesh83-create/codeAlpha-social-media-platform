import React, { useState } from 'react';
import { UserProfile } from '../types';
import { X, Check } from 'lucide-react';

interface EditProfileModalProps {
  currentUser: UserProfile;
  onClose: () => void;
  onSave: (updated: Partial<UserProfile>) => Promise<void>;
}

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=300&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&h=300&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&h=300&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&h=300&q=80',
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  currentUser,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(currentUser.name);
  const [headline, setHeadline] = useState(currentUser.headline || '');
  const [company, setCompany] = useState(currentUser.company || '');
  const [education, setEducation] = useState(currentUser.education || '');
  const [bio, setBio] = useState(currentUser.bio || '');
  const [location, setLocation] = useState(currentUser.location || '');
  const [website, setWebsite] = useState(currentUser.website || '');
  const [avatar, setAvatar] = useState(currentUser.avatar || '');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || saving) return;

    setSaving(true);
    try {
      await onSave({
        name: name.trim(),
        headline: headline.trim(),
        company: company.trim(),
        education: education.trim(),
        bio: bio.trim(),
        location: location.trim(),
        website: website.trim(),
        avatar: avatar.trim(),
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-zinc-200 overflow-hidden my-6">
        
        <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
          <h3 className="font-bold text-base text-zinc-900">Edit Intro & Profile</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* Avatar selector */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Profile Photo</label>
            <div className="flex items-center gap-3 mb-2">
              <img
                src={avatar || currentUser.avatar}
                alt="Avatar preview"
                className="w-14 h-14 rounded-full object-cover border-2 border-[#0a66c2] shadow-xs"
              />
              <div className="flex-1">
                <input
                  type="url"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="Paste custom photo URL..."
                  className="w-full text-xs px-3 py-1.5 border border-zinc-300 rounded-lg focus:outline-none focus:border-[#0a66c2]"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-zinc-400">Presets:</span>
              {AVATAR_PRESETS.map((preset, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setAvatar(preset)}
                  className={`w-7 h-7 rounded-full overflow-hidden border ${
                    avatar === preset ? 'border-[#0a66c2] ring-2 ring-sky-300' : 'border-zinc-200'
                  }`}
                >
                  <img src={preset} alt="preset" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-sm px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:border-[#0a66c2]"
            />
          </div>

          {/* Headline */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Headline
            </label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Senior Full Stack Engineer @ CodeAlpha | React & Node.js"
              className="w-full text-sm px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:border-[#0a66c2]"
            />
          </div>

          {/* Current Company & Education */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">Current Company</label>
              <input
                type="text"
                placeholder="CodeAlpha Technologies"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:border-[#0a66c2]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">Education</label>
              <input
                type="text"
                placeholder="e.g. UC Berkeley"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:border-[#0a66c2]"
              />
            </div>
          </div>

          {/* Location & Website */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">Location</label>
              <input
                type="text"
                placeholder="San Francisco Bay Area, CA"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:border-[#0a66c2]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">Website / Portfolio</label>
              <input
                type="url"
                placeholder="https://alexchen.dev"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:border-[#0a66c2]"
              />
            </div>
          </div>

          {/* Summary / Bio */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">About Summary</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Summary of your engineering background, achievements, and tech stack..."
              className="w-full text-xs px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:border-[#0a66c2] resize-none"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-zinc-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 rounded-full"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !name.trim()}
              className="px-6 py-2 bg-[#0a66c2] hover:bg-[#004182] disabled:opacity-50 text-white rounded-full text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
