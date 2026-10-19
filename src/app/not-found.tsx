import Link from 'next/link';
import { Home, SearchX, ShoppingBasket } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-[#f7faf7] px-4 py-12">
      <div className="w-full max-w-lg text-center">
        {/* Logo */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-xl font-bold text-green-700"
        >
          <ShoppingBasket size={28} />
          <span>বাজার দর</span>
        </Link>

        {/* 404 Illustration */}
        <div className="relative mx-auto mb-6 flex h-48 w-48 items-center justify-center rounded-full bg-green-100">
          <div className="absolute inset-4 rounded-full border-2 border-dashed border-green-300" />

          <SearchX size={90} strokeWidth={1.5} className="text-green-700" />

          <span className="absolute -right-2 top-3 rounded-xl bg-red-100 px-3 py-1 text-sm font-bold text-red-600">
            404
          </span>
        </div>

        {/* Heading */}
        <h1 className="mb-3 text-3xl font-extrabold text-gray-900 sm:text-4xl">
          পেজটি খুঁজে পাওয়া যায়নি!
        </h1>

        {/* Description */}
        <p className="mx-auto mb-8 max-w-md text-base leading-7 text-gray-600">
          দুঃখিত! আপনি যে পেজটি খুঁজছেন সেটি পাওয়া যাচ্ছে না।
          পেজটি সরানো হতে পারে অথবা ঠিকানাটি ভুল হতে পারে।
        </p>

        {/* Home Button */}
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-green-800 hover:shadow-lg"
        >
          <Home size={20} />
          হোম পেজে ফিরে যান
        </Link>

        {/* Footer Text */}
        <p className="mt-8 text-sm text-gray-500">
          সঠিক তথ্য, সচেতন বাজার ❤️
        </p>
      </div>
    </main>
  );
}
