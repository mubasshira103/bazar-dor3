
'use client';

import { useEffect, useState } from 'react';
import { getProducts } from '../lib/api';
import { formatPrice, getUnitBn } from '../lib/utils';

type Product = {
  id: number | string;
  image: string;
  nameBn: string;
  today: number;
  unit: string;
  change: {
    dir: 'up' | 'down' | 'flat';
    pct: number;
  };
};

export default function PriceTicker() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProducts()
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.error('পণ্যের দাম লোড করা যায়নি:', error);
      });
  }, []);

  const items = products.length ? [...products, ...products] : [];

  return (
    <div className="overflow-hidden border-y border-emerald-100 bg-white/80">
      <div className="flex w-max animate-[marquee_35s_linear_infinite] hover:[animation-play-state:paused]">
        {items.map((p, i) => (
          <div
            key={`${p.id}-${i}`}
            className="flex shrink-0 items-center gap-2 border-r border-gray-100 px-5 py-2 text-xs sm:text-sm"
          >
            <span>{p.image}</span>

            <span className="font-medium">{p.nameBn}</span>

            <span className="text-gray-500">
              {formatPrice(p.today)} টাকা/
              {getUnitBn(p.unit).replace('প্রতি ', '')}
            </span>

            <span
              className={
                p.change.dir === 'up'
                  ? 'text-red-600'
                  : p.change.dir === 'down'
                    ? 'text-emerald-600'
                    : 'text-gray-500'
              }
            >
              {p.change.dir === 'up'
                ? '▲'
                : p.change.dir === 'down'
                  ? '▼'
                  : '—'}{' '}
              {formatPrice(p.change.pct)}%
            </span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }

          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}

