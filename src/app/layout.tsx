import type { Metadata } from 'next';

import './globals.css';
import Navbar from './components/Navbar';
import { Toaster } from 'react-hot-toast';
import { Hind_Siliguri } from 'next/font/google';
// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

const hind = Hind_Siliguri({
  subsets: ['bengali', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'বাজার দর | BazarDor',
  description: 'বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের সম্ভাব্য বাজারদর এক নজরে।',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="bn" data-theme="light">
      <body className={`${hind.className} min-h-screen antialiased`}>
        <Navbar></Navbar>
        <main className="min-h-[65vh]">{children}</main>

        <Toaster position="top-center" toastOptions={{ duration: 3500 }} />
      </body>
    </html>
  );
}
