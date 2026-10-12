import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { requestAccountVerification, verifyAccount } from '../API/AccountVerificationAPI';

function AccountVerification() {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [purpose, setPurpose] = useState(searchParams.get('purpose') || 'activation');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const requestOtp = async (event) => {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      await requestAccountVerification({ email, purpose });
      setSent(true);
      setMessage('OTP sent to the registered phone number.');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to send OTP.');
    } finally {
      setBusy(false);
    }
  };

  const verify = async (event) => {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      await verifyAccount({ email, otp, purpose });
      setMessage('Account verified. You can now sign in.');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Invalid or expired OTP.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <section className="w-full max-w-md rounded-2xl bg-white p-7 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-800">Verify account</h1>
        <p className="mt-2 text-sm text-slate-500">Enter the OTP sent to your registered mobile number.</p>
        <input className="mt-6 w-full rounded-xl border p-3" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" />
        <select className="mt-3 w-full rounded-xl border p-3" value={purpose} onChange={(e) => setPurpose(e.target.value)}>
          <option value="activation">New account activation</option>
          <option value="reactivation">Account reactivation</option>
        </select>
        <button className="mt-4 w-full rounded-xl bg-[#8DC63F] p-3 font-semibold text-white disabled:opacity-50" disabled={busy || !email} onClick={requestOtp}>
          {busy ? 'Please wait...' : sent ? 'Resend OTP' : 'Send OTP'}
        </button>
        {sent && <input className="mt-4 w-full rounded-xl border p-3 tracking-[0.4em]" inputMode="numeric" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} placeholder="6-digit OTP" />}
        {sent && <button className="mt-3 w-full rounded-xl bg-slate-800 p-3 font-semibold text-white disabled:opacity-50" disabled={busy || otp.length !== 6} onClick={verify}>Verify account</button>}
        {message && <p className="mt-4 text-sm text-slate-600">{message}</p>}
      </section>
    </main>
  );
}

export default AccountVerification;
