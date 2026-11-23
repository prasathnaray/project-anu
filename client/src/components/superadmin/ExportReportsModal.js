import React, { useState } from 'react';
import { 
  X, 
  FileDown, 
  FileText, 
  Printer, 
  CheckCircle2, 
  Activity, 
  ShieldAlert, 
  Landmark, 
  Zap, 
  Server,
  Calendar
} from 'lucide-react';
import { exportReportAPI } from '../../API/SuperAdminStatsAPI';

export default function ExportReportsModal({
  isOpen,
  onClose,
  currentDateFilter = '30days'
}) {
  const [reportType, setReportType] = useState('monthly_institutions');
  const [reportRange, setReportRange] = useState(currentDateFilter);
  const [isExporting, setIsExporting] = useState(false);
  const [reportPreview, setReportPreview] = useState(null);

  if (!isOpen) return null;

  const REPORT_OPTIONS = [
    {
      id: 'daily_health',
      name: 'Daily System Health Report',
      description: 'API gateway latency history, PostgreSQL query response times, uptime SLA compliance and incident logs.',
      icon: Activity,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200'
    },
    {
      id: 'weekly_activity',
      name: 'Weekly User Activity Report',
      description: 'Role-wise operational distribution, module action breakdowns, volume conversions and challenges.',
      icon: Zap,
      color: 'text-amber-600 bg-amber-50 border-amber-200'
    },
    {
      id: 'monthly_institutions',
      name: 'Monthly Institution Performance Report',
      description: 'Full ranking ledger, student enrollments, course completion percentages, VR simulations and tier categorization.',
      icon: Landmark,
      color: 'text-[#8DC63F] bg-lime-50 border-lime-200'
    },
    {
      id: 'security_audit',
      name: 'Security & Threat Audit Report',
      description: 'Failed login attempts, brute-force detection events, account lockouts and high-privilege administrative actions.',
      icon: ShieldAlert,
      color: 'text-rose-600 bg-rose-50 border-rose-200'
    },
    {
      id: 'api_performance',
      name: 'API Reliability & Performance Report',
      description: 'Detailed API success vs failure rates, server availability SLA, Node.js memory profile and service diagnostics.',
      icon: Server,
      color: 'text-blue-600 bg-blue-50 border-blue-200'
    }
  ];

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const res = await exportReportAPI({
        type: reportType,
        format: 'csv',
        dateFilter: reportRange
      });

      const blob = new Blob([res.data], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ANU_${reportType}_${reportRange}_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export report CSV:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrintPDF = async () => {
    setIsExporting(true);
    try {
      const res = await exportReportAPI({
        type: reportType,
        format: 'json',
        dateFilter: reportRange
      });
      const data = res?.data?.data || res?.data;

      // Create a printable window
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${data?.title || 'Project ANU Report'}</title>
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 30px; color: #1e293b; }
                h1 { color: #2e5a1c; font-size: 22px; border-bottom: 2px solid #8DC63F; padding-bottom: 8px; margin-bottom: 4px; }
                .meta { font-size: 11px; color: #64748b; margin-bottom: 20px; }
                .summary-card { background: #f8faf6; border: 1px solid #e5edd8; border-radius: 8px; padding: 12px; margin-bottom: 20px; }
                .summary-title { font-weight: bold; font-size: 13px; margin-bottom: 8px; }
                table { width: 100%; border-collapse: collapse; font-size: 11px; margin-top: 15px; }
                th { background: #f1f5f9; text-align: left; padding: 8px; border-bottom: 2px solid #cbd5e1; }
                td { padding: 8px; border-bottom: 1px solid #e2e8f0; }
                .footer { margin-top: 30px; font-size: 10px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 8px; }
              </style>
            </head>
            <body>
              <h1>${data?.title}</h1>
              <div class="meta">
                Generated: ${new Date(data?.generatedAt).toLocaleString()} | Evaluated Range: ${data?.dateRange} | Scope: Global Multi-Tenant
              </div>
              <div class="summary-card">
                <div class="summary-title">Executive Summary</div>
                ${Object.entries(data?.summary || {}).map(([k, v]) => `<div><strong>${k}:</strong> ${v}</div>`).join('')}
              </div>
              <table>
                <thead>
                  <tr>${(data?.headers || []).map(h => `<th>${h}</th>`).join('')}</tr>
                </thead>
                <tbody>
                  ${(data?.rows || []).map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}
                </tbody>
              </table>
              <div class="footer">Project ANU (Antenatal Ultrasound) SaaS Learning Platform &copy; 2026. Official Super Admin Audit Record.</div>
              <script>window.onload = function() { window.print(); }<\/script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    } catch (err) {
      console.error('Failed to open PDF print preview:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-lime-100 text-[#8DC63F] border border-lime-200">
              <FileDown size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Automated Dashboard Reports</h3>
              <p className="text-xs text-slate-400">Generate executive performance, security audits, and health summaries</p>
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
          {/* Step 1: Select Report Type */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2">
              1. Select Report Category
            </label>
            <div className="space-y-2">
              {REPORT_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const isSelected = reportType === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setReportType(opt.id)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-start gap-3 ${
                      isSelected ? 'border-[#8DC63F] bg-lime-50/40 shadow-xs' : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className={`p-2 rounded-lg shrink-0 border ${opt.color}`}>
                      <Icon size={16} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`font-bold ${isSelected ? 'text-slate-900' : 'text-slate-700'}`}>
                          {opt.name}
                        </span>
                        {isSelected && <span className="w-2 h-2 rounded-full bg-[#8DC63F]" />}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                        {opt.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 2: Time Range */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              2. Evaluation Date Range
            </label>
            <div className="flex items-center gap-2">
              {[
                { id: 'today', label: 'Today (24 Hours)' },
                { id: '7days', label: 'Past 7 Days' },
                { id: '30days', label: 'Past 30 Days' }
              ].map((r) => (
                <button
                  key={r.id}
                  onClick={() => setReportRange(r.id)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                    reportRange === r.id
                      ? 'bg-[#8DC63F] text-white border-[#8DC63F] shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintPDF}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors shadow-xs"
            >
              <Printer size={13} className="text-slate-600" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={handleExportCSV}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#8DC63F] hover:bg-[#7db037] text-white text-xs font-bold transition-colors shadow-xs"
            >
              <FileDown size={14} />
              <span>{isExporting ? 'Generating...' : 'Export Excel / CSV'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
