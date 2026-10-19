'use client';

import Link from 'next/link';
import { authClient } from '../../lib/auth-client';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import toast from 'react-hot-toast';

export default function SignInPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!email.trim() || !password) {
      toast.error('ইমেইল ও পাসওয়ার্ড লিখুন');
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await authClient.signIn.email({
        email,
        password,
        callbackURL: '/',
      });

      if (error) {
        toast.error(error.message || 'সাইন ইন করা যায়নি');
        return;
      }

      if (data) {
        toast.success('সাইন ইন সফল হয়েছে');
        router.push('/');
        router.refresh();
      }
    } catch {
      toast.error('সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    try {
      const { error } = await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/',
      });

      if (error) {
        toast.error(error.message || 'Google দিয়ে সাইন ইন করা যায়নি');
      }
    } catch {
      toast.error('Google Authentication-এ সমস্যা হয়েছে');
    }
  }

  async function handleGithubSignIn() {
    try {
      const { error } = await authClient.signIn.social({
        provider: 'github',
        callbackURL: '/',
      });

      if (error) {
        toast.error(error.message || 'GitHub দিয়ে সাইন ইন করা যায়নি');
      }
    } catch {
      toast.error('GitHub Authentication-এ সমস্যা হয়েছে');
    }
  }

  return (
    <main className="min-h-screen bg-[#f0f6f0] px-4 py-10 font-sans text-[#222c25] sm:px-6 sm:py-14">
      <div className="mx-auto flex min-h-[600px] w-full max-w-[480px] flex-col items-center justify-center">
        {/* Heading */}

        <div className="mb-7 text-center">
          <Link
            href="/"
            className="mb-5 inline-flex items-center gap-2 rounded-xl bg-[#078744] px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-[#056b37]"
          >
            <span className="text-lg">🛒</span>
            বাজার দর
          </Link>

          <h1 className="text-2xl font-extrabold tracking-tight sm:text-[28px]">সাইন ইন</h1>

          <p className="mt-2 text-sm leading-7 text-[#7a837d]">
            বিস্তারিত দাম ও বাজার তুলনা দেখতে অ্যাকাউন্টে প্রবেশ করুন।
          </p>
        </div>

        {/* Sign In Card */}

        <section className="w-full rounded-2xl border border-[#e4ebe5] bg-[#fbfdfb] p-5 shadow-[0_2px_6px_rgba(30,57,35,0.03)] sm:p-7">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Email */}

            <label className="flex flex-col gap-2 text-[13px] font-semibold">
              ইমেইল
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="h-11 w-full rounded-lg border border-[#dfe6e0] bg-white px-3 text-sm font-normal outline-none transition placeholder:text-[#a0a8a1] focus:border-[#078744] focus:ring-4 focus:ring-[#078744]/10"
              />
            </label>

            {/* Password */}

            <label className="flex flex-col gap-2 text-[13px] font-semibold">
              পাসওয়ার্ড
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="আপনার পাসওয়ার্ড"
                required
                className="h-11 w-full rounded-lg border border-[#dfe6e0] bg-white px-3 text-sm font-normal outline-none transition placeholder:text-[#a0a8a1] focus:border-[#078744] focus:ring-4 focus:ring-[#078744]/10"
              />
            </label>

            {/* Submit Button */}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 flex h-11 w-full items-center justify-center rounded-lg bg-[#078744] px-4 text-sm font-bold text-white shadow-[0_3px_7px_rgba(7,135,68,0.17)] transition hover:-translate-y-0.5 hover:bg-[#056b37] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'সাইন ইন হচ্ছে...' : 'সাইন ইন'}
            </button>
          </form>

          {/* Divider */}

          <div className="my-5 flex items-center gap-3 text-xs text-[#7a837d]">
            <span className="h-px flex-1 bg-[#e4ebe5]" />
            <span>অথবা</span>
            <span className="h-px flex-1 bg-[#e4ebe5]" />
          </div>

          {/* Social Login */}

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#e4ebe5] bg-white px-3 py-2.5 text-xs font-semibold transition hover:border-[#b7d8c2] hover:bg-[#f7fbf7] sm:text-[12px]"
            >
              <span className="font-bold text-[#4285f4]">G</span>
              Google দিয়ে চালিয়ে যান
            </button>

            <button
              type="button"
              onClick={handleGithubSignIn}
              className="flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#e4ebe5] bg-white px-3 py-2.5 text-xs font-semibold transition hover:border-[#b7d8c2] hover:bg-[#f7fbf7] sm:text-[12px]"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.53v-2.07c-3.1.68-3.76-1.32-3.76-1.32-.5-1.29-1.23-1.63-1.23-1.63-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15 1 .1.76 2.17 3.08 1.55.1-.72.4-1.21.7-1.49-2.48-.28-5.08-1.24-5.08-5.52 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.05 1.14a10.6 10.6 0 0 1 5.55 0c2.11-1.44 3.04-1.14 3.04-1.14.61 1.54.23 2.68.12 2.96.71.78 1.14 1.78 1.14 3 0 4.29-2.6 5.24-5.09 5.51.4.35.75 1.03.75 2.08V22c0 .29.2.64.76.53A11.1 11.1 0 0 0 12 .9Z" />
              </svg>
              GitHub দিয়ে চালিয়ে যান
            </button>
          </div>

          {/* Sign Up Link */}

          <p className="mt-5 text-center text-xs text-[#7a837d]">
            অ্যাকাউন্ট নেই?{' '}
            <Link
              href="/signup"
              className="font-bold text-[#078744] transition hover:text-[#056b37] hover:underline"
            >
              সাইন আপ করুন
            </Link>
          </p>
        </section>

        {/* Home Link */}

        <Link href="/" className="mt-6 text-xs text-[#7a837d] transition hover:text-[#078744]">
          ← হোম পেজে ফিরে যান
        </Link>
      </div>
    </main>
  );
}
