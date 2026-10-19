import type { Product } from '@/lib/types';
import ProductCard from './ProductCard';
import SectionTitle from './SectionTitle';

export function PriceSection({ products, kind }: { products: Product[]; kind: 'up' | 'down' }) {
  const filtered = products
    .filter((p) => p.change.dir === kind)
    .sort((a, b) => b.change.pct - a.change.pct)
    .slice(0, 6);
  return (
    <section className="mb-12">
      <SectionTitle
        title={kind === 'up' ? '🔺 আজ দাম বেড়েছে' : '🟢 আজ দাম কমেছে'}
        subtitle={kind === 'up' ? 'যেসব পণ্যের দাম আজ বেড়েছে' : 'যেসব পণ্যের দাম আজ কমেছে'}
      />
      {filtered.length ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <p className="rounded-xl bg-white p-5 text-sm text-gray-500">
          এই মুহূর্তে কোনো তথ্য পাওয়া যায়নি।
        </p>
      )}
    </section>
  );
}
export function AllProducts({ products }: { products: Product[] }) {
  return (
    <section id="সব-পণ্য" className="scroll-mt-52">
      <SectionTitle title="সব পণ্য" subtitle="প্রয়োজনীয় পণ্যের আজকের বাজারদর এক নজরে দেখুন।" />
      {products.length ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl bg-white p-8 text-center text-gray-500">
          পণ্যের তথ্য লোড করা যায়নি। API URL ও response format যাচাই করুন।
        </div>
      )}
    </section>
  );
}
