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

  return (
    <div className="flex flex-col min-h-screen">
      <div className="fixed top-0 left-0 w-full z-10 h-12 shadow bg-white"><NavBar /></div>
      <div className={`${buttonOpen ? 'ms-[221px]' : 'ms-[55.5px]'} flex-grow overflow-y-auto bg-gray-100 h-[calc(100vh-3rem)]`}>
        <SideBar handleButtonOpen={() => setButtonOpen(!buttonOpen)} buttonOpen={buttonOpen} />
        <main className="mt-12 max-w-[1400px] mx-auto p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div>
              <h1 className="text-xl font-semibold text-gray-700">Login sessions</h1>
              <p className="text-sm text-gray-500">See signed-in devices and recent login history.</p>
            </div>
            <button onClick={handleEndAll} disabled={busy || loading || activeCount === 0}
              className="px-4 py-2 rounded bg-red-600 text-white disabled:opacity-50">
              Logout all
            </button>
          </div>

          {canManageOthers && (
            <section className="bg-white border rounded p-4 mb-5">
              <label htmlFor="session-user-search" className="block font-medium text-gray-700 mb-2">Choose a user</label>
              <input id="session-user-search" value={search} onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name or email" className="w-full max-w-md border rounded px-3 py-2" />
              <select value={selectedEmail} onChange={(event) => setSelectedEmail(event.target.value)}
                className="block w-full max-w-md border rounded px-3 py-2 mt-3" aria-label="Selected user">
                <option value={myEmail}>My sessions</option>
                {selectedEmail !== myEmail && !users.some((user) => user.user_email === selectedEmail) &&
                  <option value={selectedEmail}>{view?.user?.user_name || selectedEmail}</option>}
                {users.filter((user) => user.user_email !== myEmail).map((user) =>
                  <option key={user.user_email} value={user.user_email}>
                    {user.user_name} ({user.user_email})
                  </option>)}
              </select>
            </section>
          )}

          <section className="bg-white border rounded overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <div>
                <h2 className="font-semibold text-gray-700">{view?.user?.user_name || selectedEmail}</h2>
                <p className="text-sm text-gray-500">{view?.user?.user_email || selectedEmail}</p>
              </div>
              <span className="text-sm text-gray-600">{activeCount} active</span>
            </div>
            {loading ? <p className="p-5 text-gray-500">Loading sessions…</p> : sessions.length === 0
              ? <p className="p-5 text-gray-500">No sessions in the last 30 days.</p>
              : <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-600">
                      <tr>
                        <th className="p-3">Device</th><th className="p-3">Logged in</th>
                        <th className="p-3">Last activity</th><th className="p-3">Status</th>
                        <th className="p-3">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sessions.map((session) => (
                        <tr key={session.id} className="border-t">
                          <td className="p-3">
                            <div className="font-medium">{session.device} · {session.os}</div>
                            <div className="text-gray-500">{session.login_source}
                              {session.id === view.currentSessionId ? ' · This session' : ''}</div>
                          </td>
                          <td className="p-3">{formatTime(session.logged_in_at)}</td>
                          <td className="p-3">{formatTime(session.last_seen_at)}</td>
                          <td className="p-3 capitalize">{session.status}</td>
                          <td className="p-3">
                            {session.status === 'active' &&
                              <button disabled={busy} onClick={() => handleEndOne(session)}
                                className="text-red-600 font-medium disabled:opacity-50">Logout this session</button>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>}
          </section>
        </main>
      </div>
    </div>
  );
}

export default Sessions;
