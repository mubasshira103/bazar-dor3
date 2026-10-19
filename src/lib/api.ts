import { normalizeCategories, normalizeProducts } from './utils';
import type { Category, Product } from './types';

const BASE = (
  process.env.BAZARDOR_API_URL || 'https://openapi.programming-hero.com/api/bazardor'
).replace(/\/$/, '');

async function read(path: string, options?: { suppressError?: boolean }) {
  const response = await fetch(`${BASE}${path}`, { next: { revalidate: 60 } });
  if (!response.ok) {
    if (options?.suppressError) {
      return null;
    }
    throw new Error(`BazarDor API returned ${response.status}`);
  }
  return response.json();
}

export async function getProducts(category?: string): Promise<Product[]> {
  try {
    const data = await read(
      `/products${category ? `?category=${encodeURIComponent(category)}` : ''}`,
      { suppressError: true }
    );
    if (!data) return [];
    return normalizeProducts(data);
  } catch (error) {
    console.error('Product API error:', error);
    return [];
  }
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  try {
    const data = await read(`/products/${encodeURIComponent(slug)}`, { suppressError: true });
    if (data) {
      const normalized = normalizeProducts(data?.data ?? data);
      if (normalized[0]) return normalized[0];
    }
  } catch (error) {
    console.error('Single product endpoint unavailable; trying list:', error);
  }
  return (await getProducts()).find((p) => p.slug === slug || String(p.id) === slug);
}

export async function getCategories(): Promise<Category[]> {
  try {
    const data = await read('/categories', { suppressError: true });
    if (!data) return [];
    return normalizeCategories(data);
  } catch (error) {
    console.error('Category API error:', error);
    return [];
  }
}

export async function getCategory(slug: string): Promise<Category | undefined> {
  try {
    const data = await read(`/categories/${encodeURIComponent(slug)}`, { suppressError: true });
    if (data) {
      return normalizeCategories(data?.data ?? data)[0];
    }
  } catch {
    // ignore
  }
  return (await getCategories()).find((c) => c.slug === slug || c.id === slug);
}
