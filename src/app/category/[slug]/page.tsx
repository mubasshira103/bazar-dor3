import { notFound } from 'next/navigation';
import { getCategories, getCategory, getProducts } from '../../../lib/api';
import CategoryProducts from '../../components/CategoryProducts';
export async function generateStaticParams() {
  return (await getCategories()).map((c) => ({ slug: c.slug }));
}
export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [category, products, categories] = await Promise.all([
    getCategory(slug),
    getProducts(slug),
    getCategories(),
  ]);
  const resolved = category || categories.find((c) => c.slug === slug || c.id === slug);
  if (!resolved) notFound();
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-7 rounded-2xl border border-emerald-100 bg-white p-6">
        <div className="flex items-center gap-4">
          <div className="grid size-16 place-items-center rounded-2xl bg-emerald-50 text-4xl">
            {resolved.icon}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{resolved.nameBn}</h1>
            <p className="mt-1 text-sm text-gray-500">এই ক্যাটাগরির পণ্যের আজকের দাম ও পরিবর্তন</p>
          </div>
        </div>
      </div>
      <CategoryProducts products={products} />
    </div>
  );
}
