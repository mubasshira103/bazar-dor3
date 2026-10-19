import Link from 'next/link';
import type { Product } from '../../lib/types';
import { formatPrice, getUnitBn } from '../../lib/utils';
export default function ProductCard({ product }: { product: Product }) {
  const up = product.change.dir === 'up',
    down = product.change.dir === 'down';
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        <div className="grid size-14 shrink-0 place-items-center rounded-xl bg-emerald-50 text-3xl">
          {product.image || product.categoryIcon}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-gray-800 group-hover:text-emerald-800">{product.nameBn}</h3>
          <p className="mt-1 text-xs text-gray-500">{getUnitBn(product.unit)}</p>
        </div>
      </div>
      <div className="mt-5 flex items-end justify-between gap-2">
        <div>
          <p className="text-xs text-gray-500">আজকের দাম</p>
          <p className="mt-1 text-xl font-bold">
            {formatPrice(product.today)} <span className="text-sm font-medium">টাকা</span>
          </p>
        </div>
        <span
          className={`badge border-0 text-xs font-semibold ${up ? 'bg-red-50 text-red-600' : down ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}
        >
          {up ? '▲' : down ? '▼' : '—'} {formatPrice(product.change.pct)}%
        </span>
      </div>
    </Link>
  );
}
