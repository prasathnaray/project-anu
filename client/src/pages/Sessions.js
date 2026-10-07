import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import NavBar from '../components/navBar';
import SideBar from '../components/sideBar';
import {
  getMySessions, getUserSessions, searchSessionUsers,
  endSession, endAllSessions
} from '../API/sessionAPI';
import clearLocalSession from '../Auth/clearLocalSession';
import { CheckCircle2, ChevronLeft, ChevronRight, Clock3, LogOut, Monitor, Search, ShieldCheck, UserRound } from 'lucide-react';

const formatTime = (value) => value ? new Date(value).toLocaleString() : '—';

function Sessions() {
  const navigate = useNavigate();
  const decoded = jwtDecode(localStorage.getItem('user_token'));
  const myEmail = decoded.user_mail;
  const canManageOthers = [99, 101].includes(Number(decoded.role));
  const [buttonOpen, setButtonOpen] = useState(true);
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(myEmail);
  const [view, setView] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [sessionPage, setSessionPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    if (!canManageOthers) return;
    let cancelled = false;
    const timer = setTimeout(() => {
      searchSessionUsers(search)
        .then((response) => { if (!cancelled) setUsers(response.data.users || []); })
        .catch(() => { if (!cancelled) toast.error('Unable to search users.'); });
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [search, canManageOthers]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setView(null);
    const request = selectedEmail === myEmail ? getMySessions() : getUserSessions(selectedEmail);
    request.then((response) => {
      if (!cancelled) setView(response.data);
    }).catch((error) => {
      if (!cancelled) toast.error(error.response?.data?.message || 'Unable to load sessions.');
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, [selectedEmail, myEmail]);

  useEffect(() => {
    setSessionPage(1);
  }, [selectedEmail]);

  const refreshView = async () => {
    const response = selectedEmail === myEmail
      ? await getMySessions() : await getUserSessions(selectedEmail);
    setView(response.data);
  };

  const finishCurrentSession = () => {
    clearLocalSession();
    navigate('/');
  };

  const handleEndOne = async (session) => {
    if (!window.confirm(`Logout this ${session.device} session?`)) return;
    setBusy(true);
    try {
      const response = await endSession(selectedEmail, session.id);
      if (response.data.currentSessionEnded) return finishCurrentSession();
      toast.success('Session logged out.');
      await refreshView();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to log out session.');
    } finally {
      setBusy(false);
    }
  };

  const handleEndAll = async () => {
    if (!window.confirm(`Logout all sessions for ${view?.user?.user_name || selectedEmail}?`)) return;
    setBusy(true);
    try {
      const response = await endAllSessions(selectedEmail);
      if (response.data.currentSessionEnded) return finishCurrentSession();
      toast.success(`${response.data.ended} session(s) logged out.`);
      await refreshView();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to log out sessions.');
    } finally {
      setBusy(false);
    }
  };

  const sessions = view?.user?.user_email === selectedEmail ? view.sessions : [];
  const activeCount = sessions.filter((session) => session.status === 'active').length;
  const currentSession = sessions.find((session) => session.id === view?.currentSessionId) || sessions.find((session) => session.status === 'active');
  const otherSessions = sessions.filter((session) => session.id !== currentSession?.id);
  const totalSessionPages = Math.max(1, Math.ceil(otherSessions.length / pageSize));
  const paginatedSessions = otherSessions.slice((sessionPage - 1) * pageSize, sessionPage * pageSize);
  const pageItems = totalSessionPages <= 7
    ? Array.from({ length: totalSessionPages }, (_, index) => index + 1)
    : sessionPage <= 4
      ? [1, 2, 3, 4, 5, 'ellipsis-end', totalSessionPages]
      : sessionPage >= totalSessionPages - 3
        ? [1, 'ellipsis-start', totalSessionPages - 4, totalSessionPages - 3, totalSessionPages - 2, totalSessionPages - 1, totalSessionPages]
        : [1, 'ellipsis-start', sessionPage - 1, sessionPage, sessionPage + 1, 'ellipsis-end', totalSessionPages];

  useEffect(() => {
    if (sessionPage > totalSessionPages) setSessionPage(totalSessionPages);
  }, [sessionPage, totalSessionPages]);

  return (
    <div className="flex min-h-screen flex-col bg-[#f7f8f5]">
      <div className="fixed left-0 top-0 z-10 h-12 w-full bg-white shadow-sm"><NavBar /></div>
      <div className={`${buttonOpen ? 'ms-[221px]' : 'ms-[55.5px]'} flex-grow overflow-y-auto bg-[radial-gradient(circle_at_top_right,_rgba(141,198,63,0.10),_transparent_32%),#f7f8f5] h-[calc(100vh-3rem)] transition-all`}>
        <SideBar handleButtonOpen={() => setButtonOpen(!buttonOpen)} buttonOpen={buttonOpen} />
        <main className="mx-auto mt-12 max-w-[1400px] p-5 sm:p-7 lg:p-10">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400"><span>LMS workspace</span><span className="text-[#8DC63F]">/</span><span>Account security</span></div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Login sessions</h1>
              <p className="mt-1 text-sm text-slate-500">Review signed-in devices and keep your learning workspace secure.</p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-[#8DC63F]/25 bg-white px-3 py-1.5 text-xs font-semibold text-[#638f25] shadow-sm"><ShieldCheck size={14} /> Secure workspace</div>
          </div>

          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8DC63F]/12 text-[#719f2c]"><Monitor size={19} /></div><div><div className="text-xl font-bold text-slate-800">{sessions.length}</div><div className="text-xs font-medium text-slate-500">Recent devices</div></div></div>
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8DC63F]/12 text-[#719f2c]"><CheckCircle2 size={19} /></div><div><div className="text-xl font-bold text-slate-800">{activeCount}</div><div className="text-xs font-medium text-slate-500">Active now</div></div></div>
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600"><Clock3 size={19} /></div><div><div className="text-xl font-bold text-slate-800">30 days</div><div className="text-xs font-medium text-slate-500">History retained</div></div></div>
          </div>

          <div className="mb-5 flex justify-end">
            <button onClick={handleEndAll} disabled={busy || loading || activeCount === 0}
              className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3.5 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40">
              <LogOut size={15} /> Logout all sessions
            </button>
          </div>

          {canManageOthers && (
            <section className="mb-5 rounded-xl border border-slate-200 bg-white p-5">
              <div className="mb-4 flex items-start gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#8DC63F]/12 text-[#719f2c]"><UserRound size={17} /></div><div><h2 className="text-sm font-bold text-slate-800">Manage user sessions</h2><p className="mt-1 text-xs text-slate-500">Select a user to review their active LMS devices.</p></div></div>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="relative"><Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input id="session-user-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name or email" className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#8DC63F] focus:bg-white focus:ring-4 focus:ring-[#8DC63F]/10" /></div>
                <select value={selectedEmail} onChange={(event) => setSelectedEmail(event.target.value)} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#8DC63F] focus:bg-white focus:ring-4 focus:ring-[#8DC63F]/10" aria-label="Selected user">
                <option value={myEmail}>My sessions</option>
                {selectedEmail !== myEmail && !users.some((user) => user.user_email === selectedEmail) &&
                  <option value={selectedEmail}>{view?.user?.user_name || selectedEmail}</option>}
                {users.filter((user) => user.user_email !== myEmail).map((user) =>
                  <option key={user.user_email} value={user.user_email}>
                    {user.user_name} ({user.user_email})
                  </option>)}
                </select>
              </div>
            </section>
          )}

          {loading ? <section className="rounded-xl border border-slate-200 bg-white p-8 text-sm text-slate-500">Loading sessions…</section> : sessions.length === 0 ? <section className="rounded-xl border border-slate-200 bg-white px-5 py-14 text-center"><Monitor size={26} className="mx-auto mb-3 text-[#8DC63F]" /><p className="text-sm font-semibold text-slate-600">No recent sessions</p><p className="mt-1 text-xs text-slate-400">No sessions were found in the last 30 days.</p></section> : (
            <div className="grid min-w-0 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
              <section className="min-w-0 space-y-4">
                <div className="flex items-center justify-between"><div><h2 className="text-sm font-bold text-slate-800">Signed-in devices</h2><p className="mt-1 text-xs text-slate-500">{view?.user?.user_name || selectedEmail}</p></div><span className="text-xs font-semibold text-slate-400">{sessions.length} total</span></div>
                {currentSession && <div className="relative overflow-hidden rounded-2xl border border-[#cfe5b5] bg-gradient-to-br from-[#f0f9e5] via-white to-white p-5 shadow-[0_14px_35px_-28px_rgba(72,104,30,.6)]"><div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full border-[14px] border-[#8DC63F]/10" /><div className="relative flex flex-wrap items-start justify-between gap-4"><div className="flex items-start gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#719f2c] shadow-sm"><Monitor size={21} /></div><div><div className="flex items-center gap-2"><h3 className="text-base font-bold text-slate-800">{currentSession.device} · {currentSession.os}</h3><span className="rounded-full bg-[#8DC63F]/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#638f25]">Current</span></div><p className="mt-1 text-xs text-slate-500">{currentSession.login_source} · Signed in {formatTime(currentSession.logged_in_at)}</p><p className="mt-2 text-xs font-medium text-[#638f25]">Last activity {formatTime(currentSession.last_seen_at)}</p></div></div><ShieldCheck size={20} className="text-[#8DC63F]" /></div></div>}
                {otherSessions.length > 0 && <div className="rounded-xl border border-slate-200 bg-white"><div className="border-b border-slate-100 px-4 py-4 sm:px-5"><h3 className="text-sm font-bold text-slate-800">Other recent sessions</h3><p className="mt-1 text-xs text-slate-500">Devices that accessed this workspace in the last 30 days.</p></div><div className="divide-y divide-slate-100">{paginatedSessions.map((session) => <div key={session.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 transition hover:bg-[#8DC63F]/[0.035] sm:gap-4 sm:px-5"><div className="flex min-w-0 flex-1 items-center gap-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500"><Monitor size={17} /></div><div className="min-w-0"><div className="truncate text-sm font-semibold text-slate-700">{session.device} · {session.os}</div><div className="mt-1 truncate text-xs text-slate-400">{session.login_source} · {formatTime(session.last_seen_at)}</div></div></div><div className="flex w-full items-center justify-between gap-3 pl-12 sm:w-auto sm:justify-end sm:pl-0"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${session.status === 'active' ? 'bg-[#8DC63F]/12 text-[#638f25]' : 'bg-slate-100 text-slate-500'}`}>{session.status}</span>{session.status === 'active' && <button disabled={busy} onClick={() => handleEndOne(session)} className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 transition hover:text-red-700 disabled:opacity-50"><LogOut size={14} /> Logout</button>}</div></div>)}</div><div className="flex flex-col items-start gap-3 border-t border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5"><span className="text-xs text-slate-400">Page {sessionPage} of {totalSessionPages}</span><div className="flex max-w-full flex-wrap items-center justify-center gap-1 self-stretch sm:self-auto"><button type="button" disabled={sessionPage === 1} onClick={() => setSessionPage((page) => Math.max(1, page - 1))} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-[#8DC63F]/40 hover:bg-[#8DC63F]/10 hover:text-[#638f25] disabled:cursor-not-allowed disabled:opacity-35" aria-label="Previous sessions page"><ChevronLeft size={15} /></button>{pageItems.map((page) => page.toString().startsWith('ellipsis') ? <span key={page} className="flex h-8 w-6 shrink-0 items-center justify-center text-xs text-slate-400">…</span> : <button type="button" key={page} onClick={() => setSessionPage(page)} className={`h-8 min-w-8 shrink-0 rounded-lg px-2 text-xs font-semibold transition ${sessionPage === page ? 'bg-[#8DC63F] text-white' : 'border border-slate-200 text-slate-500 hover:border-[#8DC63F]/40 hover:text-[#638f25]'}`} aria-current={sessionPage === page ? 'page' : undefined}>{page}</button>)}<button type="button" disabled={sessionPage === totalSessionPages} onClick={() => setSessionPage((page) => Math.min(totalSessionPages, page + 1))} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-[#8DC63F]/40 hover:bg-[#8DC63F]/10 hover:text-[#638f25] disabled:cursor-not-allowed disabled:opacity-35" aria-label="Next sessions page"><ChevronRight size={15} /></button></div></div></div>}
              </section>
              <aside className="rounded-xl border border-slate-200 bg-white"><div className="border-b border-slate-100 px-5 py-4"><h2 className="text-sm font-bold text-slate-800">Security overview</h2><p className="mt-1 text-xs text-slate-500">A quick view of this account.</p></div><div className="space-y-4 p-5"><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#8DC63F]/12 text-[#719f2c]"><ShieldCheck size={17} /></div><div><div className="text-sm font-semibold text-slate-700">Workspace protected</div><div className="text-xs text-slate-400">Session controls are active</div></div></div><div className="border-t border-slate-100 pt-4"><div className="mb-2 flex items-center justify-between text-xs"><span className="text-slate-500">Active sessions</span><span className="font-bold text-slate-700">{activeCount}</span></div><div className="h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-[#8DC63F]" style={{ width: `${Math.min(activeCount * 25, 100)}%` }} /></div></div><div className="border-t border-slate-100 pt-4 text-xs leading-5 text-slate-400">If you see a device you do not recognise, log it out immediately and contact your administrator.</div></div></aside>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Sessions;
