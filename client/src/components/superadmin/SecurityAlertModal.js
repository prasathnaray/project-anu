import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  CheckCircle2, 
  Check, 
  AlertTriangle, 
  Clock, 
  User, 
  Layers, 
  Info, 
  FileText,
  Lock,
  ShieldCheck
} from 'lucide-react';

export default function SecurityAlertModal({
  alert,
  onClose,
  onAcknowledge,
  onResolve,
  isActioning = false
}) {
  const [notes, setNotes] = useState(alert?.notes || '');

  if (!alert) return null;

  const isCritical = alert.severity === 'CRITICAL';
  const isWarning = alert.severity === 'WARNING';
  const isResolved = alert.status === 'RESOLVED';
  const isAcknowledged = alert.status === 'ACKNOWLEDGED';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`p-5 border-b flex items-center justify-between ${
          isCritical ? 'bg-rose-50/70 border-rose-100' : isWarning ? 'bg-amber-50/70 border-amber-100' : 'bg-slate-50 border-slate-100'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${
              isCritical ? 'bg-rose-100 text-rose-700' : isWarning ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
            }`}>
              <ShieldAlert size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  isCritical ? 'bg-rose-200 text-rose-900' : isWarning ? 'bg-amber-200 text-amber-900' : 'bg-blue-200 text-blue-900'
                }`}>
                  {alert.severity}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  isResolved ? 'bg-emerald-100 text-emerald-800' : isAcknowledged ? 'bg-blue-100 text-blue-800' : 'bg-slate-200 text-slate-800'
                }`}>
                  {alert.status}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-1">{alert.title || alert.action}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Incident Summary</span>
            <p className="text-slate-700 font-medium">{alert.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-2.5 rounded-xl border border-slate-100 bg-white">
              <span className="text-[10px] text-slate-400 block font-semibold">User Email / Account</span>
              <span className="font-bold text-slate-800 font-mono break-all">{alert.user_id || 'System Event'}</span>
            </div>
            <div className="p-2.5 rounded-xl border border-slate-100 bg-white">
              <span className="text-[10px] text-slate-400 block font-semibold">Account Role</span>
              <span className="font-bold text-slate-800">{alert.role || 'Unspecified'}</span>
            </div>
            <div className="p-2.5 rounded-xl border border-slate-100 bg-white">
              <span className="text-[10px] text-slate-400 block font-semibold">Affected Module</span>
              <span className="font-bold text-slate-800">{alert.module || 'System Core'}</span>
            </div>
            <div className="p-2.5 rounded-xl border border-slate-100 bg-white">
              <span className="text-[10px] text-slate-400 block font-semibold">Event Timestamp</span>
              <span className="font-bold text-slate-800 font-mono text-[11px]">
                {new Date(alert.created_at).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Audit Metadata details */}
          {alert.metadata && Object.keys(alert.metadata).length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Audit Metadata</span>
              <pre className="p-2.5 bg-slate-900 text-slate-200 rounded-xl text-[11px] font-mono overflow-x-auto max-h-36">
                {JSON.stringify(alert.metadata, null, 2)}
              </pre>
            </div>
          )}

          {/* Resolution notes if already resolved */}
          {alert.resolvedBy && (
            <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-900">
              <span className="font-bold block">Resolution Record</span>
              <p className="text-[11px] mt-0.5">Resolved by <strong>{alert.resolvedBy}</strong> on {new Date(alert.resolvedAt).toLocaleString()}</p>
              {alert.notes && <p className="text-[11px] mt-1 italic">"{alert.notes}"</p>}
            </div>
          )}

          {/* Admin notes input */}
          {!isResolved && (
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Admin Audit Notes:
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add incident notes or resolution details..."
                rows={2}
                className="w-full text-xs p-2.5 border rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8DC63F]"
              />
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Close
          </button>

          {!isResolved && (
            <div className="flex items-center gap-2">
              {!isAcknowledged && (
                <button
                  onClick={() => onAcknowledge(alert.id, notes)}
                  disabled={isActioning}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold transition-colors shadow-xs"
                >
                  <Check size={13} />
                  <span>Acknowledge</span>
                </button>
              )}
              <button
                onClick={() => onResolve(alert.id, notes)}
                disabled={isActioning}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#8DC63F] hover:bg-[#7db037] text-white text-xs font-bold transition-colors shadow-xs"
              >
                <ShieldCheck size={14} />
                <span>Mark Resolved</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
