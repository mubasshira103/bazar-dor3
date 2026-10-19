'use client';
import { useMemo, useState } from 'react';
import type { Product } from '../lib/types';
import ProductCard from './ProductCard';
import Link from 'next/link';

export default function CategoryProducts({ products }: { products: Product[] }) {
  const [sort, setSort] = useState('default');
  const sorted = useMemo(
    () =>
      [...products].sort((a, b) =>
        sort === 'asc' ? a.today - b.today : sort === 'desc' ? b.today - a.today : 0
      ),
    [products, sort]
  );
  return (
    <>
      <div className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3">
        <span className="text-sm text-gray-500">
          মোট {products.length.toLocaleString('bn-BD')}টি পণ্য
        </span>
        <label className="flex items-center gap-2 text-sm">
          <span>সাজান</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="select select-bordered select-sm rounded-lg"
          >
            <option value="default">ডিফল্ট</option>
            <option value="asc">দাম: কম থেকে বেশি</option>
            <option value="desc">দাম: বেশি থেকে কম</option>
          </select>
        </label>
      </div>
      {sorted.length ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
          <div className="text-4xl">🔎</div>
          <h2 className="mt-3 text-xl font-bold">কোনো পণ্য পাওয়া যায়নি</h2>
          <p className="mt-2 text-sm text-gray-500">এই ক্যাটাগরিতে এখনো পণ্য যোগ করা হয়নি।</p>
          <Link href="/" className="btn btn-success mt-5 text-white">
            হোম পেজে ফিরে যান
          </Link>
        </div>
      )}
    </>
  );
}
