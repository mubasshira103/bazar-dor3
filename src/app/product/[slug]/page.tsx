import { headers } from 'next/headers';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';

import { auth } from '../../lib/auth';
import { getProduct } from '../../lib/api';
import { formatPrice, getUnitBn } from '../../lib/utils';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect(`/signin?callbackUrl=${encodeURIComponent(`/product/${slug}`)}`);
  }

  const p = await getProduct(slug);

  if (!p) notFound();

  const mins = p.markets.map((m) => m.min);
  const maxs = p.markets.map((m) => m.max);

  const min = mins.length ? Math.min(...mins) : p.today;
  const max = maxs.length ? Math.max(...maxs) : p.today;

  const avg = p.markets.length
    ? Math.round(
        p.markets.reduce((sum, market) => sum + (market.min + market.max) / 2, 0) / p.markets.length
      )
    : p.today;

  const summary = [
    {
      label: 'সর্বনিম্ন দাম',
      value: min,
      description: 'সর্বনিম্ন দামে বাজারে পাওয়া যায়',
      color: 'text-emerald-700',
    },
    {
      label: 'সর্বোচ্চ দাম',
      value: max,
      description: 'সর্বোচ্চ দামে বাজারে পাওয়া যায়',
      color: 'text-red-600',
    },
    {
      label: 'গড় দাম',
      value: avg,
      description: 'প্রতি ইউনিটের গড় হিসাব',
      color: 'text-emerald-700',
    },
    {
      label: 'আজকের দাম',
      value: p.today,
      description: `প্রতি ${getUnitBn(p.unit)}-এর হিসাবে`,
      color: 'text-emerald-700',
    },
  ];


  return (
    <main className="min-h-screen bg-[#f0f6f1] px-3 py-6 text-[#263b32] sm:px-5 sm:py-8">
      <div className="mx-auto max-w-6xl">
        {/* Breadcrumb */}
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="transition hover:text-emerald-700">
            হোম
          </Link>

          <span>›</span>

          <span>{p.categoryNameBn}</span>

          <span>›</span>

          <span className="font-medium text-gray-700">{p.nameBn}</span>
        </nav>

        {/* Product Information */}
        <section className="rounded-2xl border border-[#e2eee5] bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div className="flex min-w-0 items-center gap-4">
              <div className="grid size-16 shrink-0 place-items-center rounded-2xl bg-[#edf6ef] text-4xl sm:size-20 sm:text-5xl">
                {p.image}
              </div>

              <div className="min-w-0">
                <h1 className="text-xl font-bold tracking-tight text-[#172f25] sm:text-2xl md:text-3xl">
                  {p.nameBn}
                </h1>

                <p className="mt-1 text-sm text-gray-500 sm:text-base">
                  {getUnitBn(p.unit)} · {p.categoryNameBn}
                </p>

                <div>
                  <span>
                    গতকালকের তুলনায় আজ দাম{' '}
                    {p.change.dir === 'up' ? 'বেড়েছে' : p.change.dir === 'down' ? 'কমেছে' : '—'}{' '}
                    -{' '}
                  </span>
                  <span
                    className={`mt-2 text-sm font-bold ${
                      p.change.dir === 'up'
                        ? 'text-red-600'
                        : p.change.dir === 'down'
                          ? 'text-emerald-700'
                          : 'text-gray-500'
                    }`}
                  >
                    {p.change.dir === 'up' ? '▲' : p.change.dir === 'down' ? '▼' : '—'}{' '}
                    {formatPrice(p.change.pct)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Today's Price */}
            <div className="flex shrink-0 items-center justify-between gap-5 rounded-2xl bg-[#edf7ef] px-5 py-4 sm:block sm:min-w-40 sm:text-center">
              <div>
                <p className="text-sm text-gray-500">আজকের বাজারদর</p>

                <p className="mt-1 text-2xl font-extrabold text-emerald-800 sm:text-3xl">
                  {formatPrice(p.today)}
                </p>

                <p className="text-sm font-medium text-emerald-800">টাকা / {getUnitBn(p.unit)}</p>
              </div>

              <p
                className={`mt-2 text-sm font-bold ${
                  p.change.dir === 'up'
                    ? 'text-red-600'
                    : p.change.dir === 'down'
                      ? 'text-emerald-700'
                      : 'text-gray-500'
                }`}
              >
                {p.change.dir === 'up' ? '▲' : p.change.dir === 'down' ? '▼' : '—'}{' '}
                {formatPrice(p.change.pct)}%
              </p>
            </div>
          </div>
        </section>

        {/* Price Summary */}
        <section className="mt-6 rounded-2xl border border-[#e2eee5] bg-white p-4 shadow-sm sm:p-6">
          <h2 className="mb-4 text-lg font-bold text-[#203b2d] sm:text-xl">দামের সারসংক্ষেপ</h2>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {summary.map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-[#e4eee6] bg-[#fcfefc] p-4 transition duration-200 hover:border-emerald-200 hover:shadow-sm sm:p-5"
              >
                <p className="text-sm font-medium text-gray-500">{item.label}</p>

                <p className={`mt-2 text-2xl font-extrabold ${item.color}`}>
                  {formatPrice(item.value)} <span className="text-sm font-semibold">টাকা</span>
                </p>

                <p className="mt-2 text-xs leading-5 text-gray-500">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Market-wise Prices */}
        <section className="mt-6 rounded-2xl border border-[#e2eee5] bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-[#203b2d] sm:text-xl">বাজারভিত্তিক আজকের দাম</h2>

            <p className="mt-1 text-sm text-gray-500">
              বিভিন্ন বাজারের সর্বনিম্ন, সর্বোচ্চ ও গড় দাম
            </p>
          </div>

          {p.markets.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-[#e4eee6]">
              <table className="w-full min-w-[650px] border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-[#edf6ef] text-[#334b3e]">
                    <th className="px-4 py-4 font-semibold">বাজার</th>

                    <th className="px-4 py-4 font-semibold">বিভাগ</th>

                    <th className="px-4 py-4 text-right font-semibold">সর্বনিম্ন</th>

                    <th className="px-4 py-4 text-right font-semibold">সর্বোচ্চ</th>

                    <th className="px-4 py-4 text-right font-semibold">গড়</th>
                  </tr>
                </thead>

                <tbody>
                  {p.markets.map((market, index) => (
                    <tr
                      key={`${market.market}-${index}`}
                      className={`border-t border-[#e6eee8] transition hover:bg-emerald-50 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-[#f5f9f5]'
                      }`}
                    >
                      <td className="px-4 py-4 font-medium text-gray-700">{market.market}</td>

                      <td className="px-4 py-4 text-gray-600">{market.division}</td>

                      <td className="px-4 py-4 text-right whitespace-nowrap text-gray-700">
                        {formatPrice(market.min)} টাকা
                      </td>

                      <td className="px-4 py-4 text-right whitespace-nowrap text-gray-700">
                        {formatPrice(market.max)} টাকা
                      </td>

                      <td className="px-4 py-4 text-right whitespace-nowrap font-semibold text-emerald-800">
                        {formatPrice((market.min + market.max) / 2)} টাকা
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-xl bg-[#f5f8f5] p-6 text-center">
              <p className="text-sm text-gray-500">API থেকে বাজারভিত্তিক তথ্য পাওয়া যায়নি।</p>
            </div>
          )}
        </section>

      </div>
    </main>
  );
}
