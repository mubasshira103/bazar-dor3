'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Menu, ShoppingBasket, X, UserRound, LogOut, ChevronDown } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import { getCategories } from '../lib/api';
import type { Category } from '../lib/types';
import { getBanglaDate } from '../lib/utils';
import { signOut, useSession } from '../lib/auth-client';
import PriceTicker from './PriceTicker';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const { data: session, isPending, refetch } = useSession();

  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // ক্যাটাগরি লোড
  useEffect(() => {
    let isMounted = true;

    async function loadCategories() {
      try {
        const data = await getCategories();

        if (isMounted) {
          setCategories(data);
        }
      } catch (error: unknown) {
        console.error('ক্যাটাগরি লোড করা যায়নি:', error);
      }
    }

    void loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  // Profile update event পেলে Better Auth-এর session আবার লোড করো।
  useEffect(() => {
    const handleProfileUpdated = () => {
      void refetch();
    };

    window.addEventListener('profile-updated', handleProfileUpdated);

    return () => {
      window.removeEventListener('profile-updated', handleProfileUpdated);
    };
  }, [refetch]);

  // Logout
  const logout = async () => {
    try {
      const result = await signOut();

      if (result.error) {
        toast.error(result.error.message || 'সাইন আউট করা যায়নি!');
        return;
      }

      setUserMenuOpen(false);
      setOpen(false);

      toast.success('সাইন আউট সফল হয়েছে!');

      router.push('/');
      router.refresh();
    } catch (error: unknown) {
      console.error('Logout failed:', error);
      toast.error('সাইন আউট করার সময় সমস্যা হয়েছে!');
    }
  };

  const user = session?.user;

  return (
    <header className="sticky top-0 z-40 border-b border-[#e4ebe5] bg-[#fbfdfb]">
      {/* Top Navbar */}
      <div className="mx-auto flex h-[70px] max-w-[1180px] items-center justify-between gap-3 px-3 sm:px-5">
        {/* Logo */}
        <Link
          href="/"
          onClick={() => {
            setOpen(false);
            setUserMenuOpen(false);
          }}
          className="flex shrink-0 items-center gap-3"
        >
          <span className="grid size-[42px] place-items-center rounded-[13px] bg-[#078744] text-white">
            <ShoppingBasket size={24} />
          </span>

          <span>
            <strong className="block text-[19px] font-extrabold leading-tight text-[#222c25] sm:text-[21px]">
              বাজার দর
            </strong>
            <small className="block text-[10px] text-[#7a837d] sm:text-[11px]">
              {getBanglaDate()}
            </small>
          </span>
        </Link>

        {/* Desktop Authentication */}
        <div className="hidden items-center gap-5 sm:flex">
          {isPending ? (
            <span className="loading loading-spinner loading-sm text-[#078744]" />
          ) : user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen((prev) => !prev)}
                aria-expanded={userMenuOpen}
                aria-label="ইউজার মেনু"
                className="flex items-center gap-2 rounded-full px-2 py-1 text-[#222c25] transition hover:bg-[#e7f5ec]"
              >
                <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-[#e7f5ec] text-[#078744]">
                  {user.image ? (
                    <img
                      key={user.image}
                      src={user.image}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <UserRound size={22} />
                  )}
                </span>

                <span className="max-w-[120px] truncate text-sm font-semibold">
                  {user.name || 'প্রোফাইল'}
                </span>

                <ChevronDown size={16} />
              </button>

              {userMenuOpen && (
                <>
                  <button
                    type="button"
                    aria-label="মেনু বন্ধ করুন"
                    className="fixed inset-0 z-40 cursor-default"
                    onClick={() => setUserMenuOpen(false)}
                  />

                  <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-xl border border-[#e4ebe5] bg-white p-2 text-[#222c25] shadow-lg">
                    <Link
                      href="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition hover:bg-[#e7f5ec] hover:text-[#078744]"
                    >
                      <UserRound size={18} />
                      নিজের প্রোফাইল
                    </Link>

                    <button
                      type="button"
                      onClick={logout}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 transition hover:bg-red-50"
                    >
                      <LogOut size={18} />
                      লগআউট
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/signin"
                className="text-sm font-semibold text-[#222c25] transition hover:text-[#078744]"
              >
                সাইন ইন
              </Link>

              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-[9px] bg-[#078744] px-[18px] py-[11px] text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#056b37]"
              >
                সাইন আপ
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="grid size-10 shrink-0 place-items-center rounded-lg text-[#222c25] transition hover:bg-[#e7f5ec] sm:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label={open ? 'মেনু বন্ধ করুন' : 'মেনু খুলুন'}
          aria-expanded={open}
        >
          {open ? <X size={23} /> : <Menu size={23} />}
        </button>
      </div>

      {/* Category Navigation */}
      <nav className="border-y border-[#e4ebe5]">
        <div className="mx-auto flex min-h-[46px] max-w-[1180px] items-center justify-center gap-2 overflow-x-auto px-3 [scrollbar-width:none] sm:px-5 sm:[&::-webkit-scrollbar]:hidden">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
              pathname === '/'
                ? 'bg-[#e7f5ec] text-[#078744]'
                : 'text-[#566159] hover:bg-[#e7f5ec] hover:text-[#078744]'
            }`}
          >
            <span>⌂</span>
            <span>হোম</span>
          </Link>

          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              onClick={() => setOpen(false)}
              className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                pathname === `/category/${category.slug}`
                  ? 'bg-[#e7f5ec] text-[#078744]'
                  : 'text-[#566159] hover:bg-[#e7f5ec] hover:text-[#078744]'
              }`}
            >
              {category.icon}
              <span>{category.nameBn}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div className="border-b border-[#e4ebe5] bg-[#fbfdfb] p-4 sm:hidden">
          <div className="flex flex-col gap-2">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                  pathname === `/category/${category.slug}`
                    ? 'bg-[#e7f5ec] text-[#078744]'
                    : 'text-[#566159] hover:bg-[#e7f5ec]'
                }`}
              >
                {category.icon}
                <span>{category.nameBn}</span>
              </Link>
            ))}

            <div className="mt-2 border-t border-[#e4ebe5] pt-3">
              {isPending ? (
                <span className="loading loading-spinner loading-sm text-[#078744]" />
              ) : user ? (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/profile"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-[#222c25] transition hover:bg-[#e7f5ec]"
                  >
                    <UserRound size={18} />
                    নিজের প্রোফাইল
                  </Link>

                  <button
                    type="button"
                    onClick={logout}
                    className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    <LogOut size={18} />
                    লগআউট
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Link
                    href="/signin"
                    onClick={() => setOpen(false)}
                    className="flex flex-1 items-center justify-center rounded-[9px] border border-[#e4ebe5] bg-white px-4 py-2.5 text-sm font-bold text-[#222c25] transition hover:bg-[#e7f5ec]"
                  >
                    সাইন ইন
                  </Link>

                  <Link
                    href="/signup"
                    onClick={() => setOpen(false)}
                    className="flex flex-1 items-center justify-center rounded-[9px] bg-[#078744] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#056b37]"
                  >
                    সাইন আপ
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Price Ticker */}
      <PriceTicker />
    </header>
  );
}
