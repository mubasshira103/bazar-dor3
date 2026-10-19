import { getProducts } from '@/lib/api';
import Hero from '@/components/Hero';
import { AllProducts, PriceSection } from '@/components/HomeSections';
export const revalidate = 60;
export default async function HomePage() {
  const products = await getProducts();
  return (
    <div className="mx-auto max-w-6xl  px-4 py-7 sm:py-10">
      <Hero />
      <PriceSection products={products} kind="up" />
      <PriceSection products={products} kind="down" />
      <AllProducts products={products} />
    </div>
  );
}
