import { normalizeCategories, normalizeProducts } from "./utils";
import type { Category, Product } from "./types";
const BASE = (process.env.BAZARDOR_API_URL || "https://openapi.programming-hero.com/api/bazardor").replace(/\/$/,"");
async function read(path: string) {
  const response = await fetch(`${BASE}${path}`, { next: { revalidate: 60 } });
  if (!response.ok) throw new Error(`BazarDor API returned ${response.status}`);
  return response.json();
}
export async function getProducts(category?: string): Promise<Product[]> {
  try { const data = await read(`/products${category ? `?category=${encodeURIComponent(category)}` : ""}`); return normalizeProducts(data); }
  catch (error) { console.error("Product API error:", error); return []; }
}
export async function getProduct(slug: string): Promise<Product | undefined> {
  try { const data = await read(`/products/${encodeURIComponent(slug)}`); const normalized = normalizeProducts(data?.data ?? data); if (normalized[0]) return normalized[0]; }
  catch (error) { console.error("Single product endpoint unavailable; trying list:", error); }
  return (await getProducts()).find(p => p.slug === slug || String(p.id) === slug);
}
export async function getCategories(): Promise<Category[]> {
  try { return normalizeCategories(await read("/categories")); }
  catch (error) { console.error("Category API error:", error); return []; }
}
export async function getCategory(slug: string): Promise<Category | undefined> {
  try { const data = await read(`/categories/${encodeURIComponent(slug)}`); return normalizeCategories(data?.data ?? data)[0]; }
  catch { return (await getCategories()).find(c => c.slug === slug || c.id === slug); }
}
