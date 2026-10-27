import React, { useEffect, useState } from 'react';
import { JobListing, UserProfile } from '../types';
import { api } from '../api';
import { Briefcase, MapPin, DollarSign, Clock, CheckCircle2, Search, Send } from 'lucide-react';

interface JobsViewProps {
  currentUser: UserProfile;
}

export const JobsView: React.FC<JobsViewProps> = ({ currentUser }) => {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [appliedIds, setAppliedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [applyingId, setApplyingId] = useState<string | null>(null);

  useEffect(() => {
    api.getJobs().then(setJobs).catch(console.error);
  }, []);

  const handleApply = async (jobId: string) => {
    setApplyingId(jobId);
    try {
      await api.applyJob(jobId);
      setAppliedIds((prev) => [...prev, jobId]);
    } catch (err) {
      console.error(err);
    } finally {
      setApplyingId(null);
    }
  };

  const filteredJobs = jobs.filter((j) =>
    j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Header Search Banner */}
      <div className="bg-white rounded-xl border border-zinc-200 p-4 shadow-xs">
        <h2 className="text-base font-bold text-zinc-900 mb-1">
          Explore Recommended Jobs for You
        </h2>
        <p className="text-xs text-zinc-500 mb-3">
          Based on your profile skills in React, Express.js, TypeScript, and Full Stack Development.
        </p>

        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by job title, company, or keyword (e.g. React, Express, Full Stack)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-zinc-50 border border-zinc-200 rounded-lg focus:bg-white focus:outline-none focus:border-[#0a66c2]"
          />
        </div>
      </div>

      {/* Jobs List */}
      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-xs divide-y divide-zinc-100">
        {filteredJobs.map((job) => {
          const hasApplied = appliedIds.includes(job.id);
          return (
            <div key={job.id} className="p-4 sm:p-5 hover:bg-zinc-50/60 transition-colors">
              <div className="flex items-start justify-between gap-4 flex-wrap sm:flex-nowrap">
                
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <img
                    src={job.logo}
                    alt={job.company}
                    className="w-12 h-12 rounded-lg object-cover border border-zinc-200 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-sm sm:text-base text-zinc-900 leading-snug">
                      {job.title}
                    </h3>
                    <div className="text-xs font-semibold text-zinc-700 mt-0.5">
                      {job.company}
                    </div>

                    <div className="flex items-center gap-3 flex-wrap text-xs text-zinc-500 mt-2">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{job.salary}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{job.postedDate}</span>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
                      {job.description}
                    </p>

                    <div className="flex items-center gap-1.5 flex-wrap mt-2.5">
                      {job.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-zinc-100 text-zinc-700 rounded text-[11px] font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 sm:self-center">
                  {hasApplied ? (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3.5 py-2 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Applied</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleApply(job.id)}
                      disabled={applyingId === job.id}
                      className="px-5 py-2 bg-[#0a66c2] hover:bg-[#004182] disabled:opacity-50 text-white rounded-full text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <Send className="w-3 h-3" />
                      <span>{applyingId === job.id ? 'Submitting...' : 'Easy Apply'}</span>
                    </button>
                  )}
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
