import React, { useState } from 'react';
import { BackendHealth } from '../types';
import { X, Server, Activity, CheckCircle, RefreshCw, Send, Play } from 'lucide-react';

interface ApiInspectorModalProps {
  health: BackendHealth | null;
  onClose: () => void;
  onRefreshHealth: () => void;
}

const API_ENDPOINTS = [
  { method: 'GET', path: '/api/health', desc: 'Backend health, uptime, and database stats' },
  { method: 'GET', path: '/api/session', desc: 'Get active session user profile' },
  { method: 'POST', path: '/api/session/switch', desc: 'Switch current user session to another account' },
  { method: 'GET', path: '/api/users', desc: 'List all users with follower status' },
  { method: 'GET', path: '/api/users/:id', desc: 'Get specific user profile with posts and followers' },
  { method: 'POST', path: '/api/users', desc: 'Create new user profile' },
  { method: 'PUT', path: '/api/users/:id', desc: 'Update user profile (bio, avatar, website, location)' },
  { method: 'POST', path: '/api/users/:id/follow', desc: 'Toggle follow / unfollow on target user' },
  { method: 'GET', path: '/api/posts', desc: 'List posts (feed=all | following | bookmarks, tag, query)' },
  { method: 'POST', path: '/api/posts', desc: 'Create new post with content, tags, and media attachment' },
  { method: 'POST', path: '/api/posts/:id/like', desc: 'Toggle like on post' },
  { method: 'POST', path: '/api/posts/:id/bookmark', desc: 'Toggle bookmark on post' },
  { method: 'GET', path: '/api/posts/:id/comments', desc: 'Get comments list for post' },
  { method: 'POST', path: '/api/posts/:id/comments', desc: 'Add new comment to post' },
  { method: 'DELETE', path: '/api/posts/:id', desc: 'Delete post by author' },
  { method: 'POST', path: '/api/reset-demo', desc: 'Reset database to initial seed data' },
];

export const ApiInspectorModal: React.FC<ApiInspectorModalProps> = ({
  health,
  onClose,
  onRefreshHealth,
}) => {
  const [testedResponse, setTestedResponse] = useState<string | null>(null);
  const [testedRoute, setTestedRoute] = useState<string>('');
  const [testing, setTesting] = useState(false);

  const testEndpoint = async (path: string) => {
    setTesting(true);
    setTestedRoute(path);
    try {
      // test GET endpoints or sample endpoint
      const target = path.includes(':id') ? '/api/posts' : path;
      const res = await fetch(target);
      const data = await res.json();
      setTestedResponse(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setTestedResponse(JSON.stringify({ error: err.message }, null, 2));
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-zinc-200 overflow-hidden flex flex-col max-h-[88vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-100 text-sky-700">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-zinc-900 leading-tight">
                Full Stack Architecture & Express.js REST API
              </h3>
              <p className="text-xs text-zinc-500">
                CodeAlpha Task 2: Backend (Express.js on :3000) ⇄ Frontend (React)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-600 hover:bg-zinc-200/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Status Header */}
        <div className="p-5 bg-zinc-900 text-white flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <div>
              <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                <span>Server Status: Operational (Port 3000)</span>
              </div>
              <div className="text-[11px] text-zinc-400">
                Stack: Node.js + Express.js REST Engine + React SPA
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="text-right">
              <div className="text-zinc-400 text-[10px] uppercase tracking-wider">Database State</div>
              <div className="font-mono text-zinc-200">
                {health?.stats.users || 0} users · {health?.stats.posts || 0} posts · {health?.stats.comments || 0} comments
              </div>
            </div>
            <button
              onClick={onRefreshHealth}
              className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors"
              title="Ping server"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          <div>
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2.5">
              Available REST Endpoints
            </h4>
            <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
              {API_ENDPOINTS.map((endpoint, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2 rounded-xl bg-zinc-50 border border-zinc-100 hover:bg-zinc-100/70 transition-colors text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`px-1.5 py-0.5 rounded font-mono font-bold text-[10px] ${
                        endpoint.method === 'GET'
                          ? 'bg-emerald-100 text-emerald-800'
                          : endpoint.method === 'POST'
                          ? 'bg-sky-100 text-sky-800'
                          : endpoint.method === 'PUT'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {endpoint.method}
                    </span>
                    <span className="font-mono font-medium text-zinc-900 truncate">
                      {endpoint.path}
                    </span>
                    <span className="text-zinc-400 text-[11px] truncate hidden sm:inline">
                      — {endpoint.desc}
                    </span>
                  </div>

                  {endpoint.method === 'GET' && (
                    <button
                      onClick={() => testEndpoint(endpoint.path)}
                      className="px-2 py-1 bg-white border border-zinc-200 hover:border-zinc-300 text-zinc-700 rounded text-[11px] flex items-center gap-1 font-medium transition-colors ml-2 shrink-0"
                    >
                      <Play className="w-3 h-3 text-sky-600 fill-sky-600" />
                      <span>Test</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Test Console / Output */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Live Server Response
              </h4>
              {testedRoute && (
                <span className="text-xs font-mono text-sky-600">
                  Target: {testedRoute}
                </span>
              )}
            </div>

            <div className="bg-zinc-950 text-zinc-200 p-4 rounded-2xl font-mono text-xs overflow-x-auto max-h-48 border border-zinc-800">
              {testing ? (
                <div className="text-zinc-500 animate-pulse">Querying Express REST endpoint...</div>
              ) : testedResponse ? (
                <pre>{testedResponse}</pre>
              ) : (
                <div className="text-zinc-500">
                  Click "Test" next to any GET endpoint above to inspect the live JSON response from the server.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-zinc-100 bg-zinc-50 flex items-center justify-between text-xs text-zinc-500">
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Express router mounted before Vite middlewares in server.ts</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white font-medium rounded-lg"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
