import React from 'react';
import { 
  X, 
  Landmark, 
  Users, 
  Award, 
  GraduationCap, 
  Activity, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertCircle,
  Video,
  Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function InstitutionDetailModal({ institution, onClose }) {
  const navigate = useNavigate();

  if (!institution) return null;

  const isTop = institution.tier === 'Top Performing';
  const isAttention = institution.tier === 'Requires Attention';
  const rank = institution.rank;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/80">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-lime-100 text-[#8DC63F] border border-lime-200 shrink-0">
              <Landmark size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  rank === 1 ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                  rank === 2 ? 'bg-slate-200 text-slate-800' :
                  rank === 3 ? 'bg-amber-50 text-amber-900 border border-amber-100' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  Rank #{rank}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  institution.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {institution.status}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  isTop ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                  isAttention ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                  'bg-slate-50 text-slate-600'
                }`}>
                  {institution.tier}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-1">{institution.name}</h3>
              <p className="text-xs text-slate-400 font-mono">{institution.email || 'No center email registered'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Composite Performance Card */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50/60 to-lime-50/60 border border-[#e5edd8] flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-600 block">Overall Performance Score</span>
              <span className="text-2xl font-black text-slate-900 font-mono mt-0.5">
                {institution.composite_score} / 100
              </span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-500 font-medium block">Ranking Position</span>
              <span className="text-lg font-black text-[#8DC63F]">#{rank} of Global</span>
            </div>
          </div>

          {/* 4 Performance Metric Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl border border-slate-100 bg-white">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Trainees</span>
              <span className="text-lg font-black text-slate-800 font-mono mt-0.5">
                {institution.total_trainees}
              </span>
              <span className="text-[10px] text-slate-400 block mt-1">Enrolled learners</span>
            </div>

            <div className="p-3 rounded-xl border border-slate-100 bg-white">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Trainees (30d)</span>
              <span className="text-lg font-black text-emerald-600 font-mono mt-0.5">
                {institution.active_trainees}
              </span>
              <span className="text-[10px] text-slate-400 block mt-1">
                {institution.active_ratio}% active engagement
              </span>
            </div>

            <div className="p-3 rounded-xl border border-slate-100 bg-white">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Course Completion</span>
              <span className="text-lg font-black text-slate-800 font-mono mt-0.5">
                {institution.completion_rate}%
              </span>
              <div className="w-full h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                <div 
                  className="h-full bg-[#8DC63F]" 
                  style={{ width: `${Math.min(100, institution.completion_rate)}%` }} 
                />
              </div>
            </div>

            <div className="p-3 rounded-xl border border-slate-100 bg-white">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">VR Training Performance</span>
              <span className="text-lg font-black text-purple-600 font-mono mt-0.5">
                {institution.vr_attempts}
              </span>
              <span className="text-[10px] text-slate-400 block mt-1">VR exercises & simulations</span>
            </div>
          </div>

          {/* Additional details */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 space-y-2">
            <div className="flex justify-between text-slate-600">
              <span>Center ID:</span>
              <span className="font-mono font-bold text-slate-800">{institution.center_id}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Instructors Attached:</span>
              <span className="font-bold text-slate-800">{institution.total_instructors}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Onboarded Since:</span>
              <span className="font-medium text-slate-800">
                {institution.created_at ? new Date(institution.created_at).toLocaleDateString() : 'Established Center'}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              navigate('/academics');
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#8DC63F] hover:bg-[#7db037] text-white text-xs font-bold transition-colors shadow-xs"
          >
            <span>Manage Center in Academics</span>
            <ArrowUpRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
