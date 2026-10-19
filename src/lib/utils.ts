import type { Category, Product } from './types';

const digits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export function toBengaliNumber(value: string | number): string {
  return String(value).replace(/[0-9]/g, (d) => digits[Number(d)]);
}

export function formatPrice(value: number): string {
  return toBengaliNumber(Math.round(Number(value) || 0).toLocaleString('en-IN'));
}

export function getUnitBn(unit?: string): string {
  const map: Record<string, string> = {
    kg: 'প্রতি কেজি',
    kilogram: 'প্রতি কেজি',
    litre: 'প্রতি লিটার',
    liter: 'প্রতি লিটার',
    l: 'প্রতি লিটার',
    dozen: 'প্রতি ডজন',
    piece: 'প্রতি পিস',
    pcs: 'প্রতি পিস',
    packet: 'প্রতি প্যাকেট',
  };
  return (
    map[(unit || 'kg').toLowerCase()] ||
    (unit?.startsWith('প্রতি') ? unit : `প্রতি ${unit || 'কেজি'}`)
  );
}

export function getBanglaDate(): string {
  return new Intl.DateTimeFormat('bn-BD', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Dhaka',
  }).format(new Date());
}

const categoryIcons: Record<string, string> = {
  chal: '🍚',
  dal: '🫘',
  tel: '🫙',
  sobji: '🥬',
  mach: '🐟',
  mangsho: '🍗',
  dim: '🥚',
  moshla: '🌶️',
};

function first<T>(...values: (T | undefined | null)[]): T | undefined {
  return values.find((v) => v !== undefined && v !== null);
}

function num(v: unknown, fallback = 0): number {
  const n = Number(String(v ?? '').replace(/[^0-9.-]/g, ''));
  return Number.isFinite(n) ? n : fallback;
}

export function normalizeProducts(raw: unknown): Product[] {
  const obj = raw as Record<string, unknown> | null;
  const rows = Array.isArray(raw)
    ? raw
    : Array.isArray(obj?.data)
      ? (obj.data as unknown[])
      : Array.isArray(obj?.products)
        ? (obj.products as unknown[])
        : Array.isArray((obj?.data as Record<string, unknown>)?.products)
          ? ((obj?.data as Record<string, unknown>).products as unknown[])
          : [];

  return rows.map((item: unknown, i: number) => {
    const p = item as Record<string, unknown>;
    const today = num(first(p.today, p.price, p.currentPrice, p.todayPrice, p.priceToday), 0);
    const yesterday = num(first(p.yesterday, p.yesterdayPrice, p.previousPrice), today);
    const explicit = (p.change as Record<string, unknown>) || {};
    const pct = num(
      first(explicit.pct, explicit.percentage, p.changePercent, p.change_percentage),
      yesterday ? ((today - yesterday) / yesterday) * 100 : 0
    );
    const dir = (first(explicit.dir, explicit.direction) ||
      (pct > 0 ? 'up' : pct < 0 ? 'down' : 'flat')) as Product['change']['dir'];

    const catObj = p.category as Record<string, unknown> | string | undefined;
    const catSlug = typeof catObj === 'object' && catObj !== null ? catObj.slug : catObj;
    const category = String(first(catSlug, p.categorySlug, p.category_id, 'chal')).toLowerCase();

    const marketsRaw = Array.isArray(p.markets)
      ? p.markets
      : Array.isArray(p.marketPrices)
        ? p.marketPrices
        : [];

    const markets = marketsRaw.map((marketItem: unknown) => {
      const m = marketItem as Record<string, unknown>;
      return {
        market: String(first(m.market, m.name, m.bazar, 'স্থানীয় বাজার')),
        division: String(first(m.division, m.region, 'ঢাকা')),
        min: num(first(m.min, m.minimum, m.minPrice, m.price), today),
        max: num(first(m.max, m.maximum, m.maxPrice, m.price), today),
      };
    });

    const name = String(
      first(p.nameBn, p.name_bn, p.name, p.title, p.productName, `পণ্য ${i + 1}`)
    );
    const slug = String(
      first(p.slug, p.id, name.toLowerCase().replace(/\s+/g, '-'), `product-${i + 1}`)
    );

    const categoryName = typeof catObj === 'object' && catObj !== null ? catObj.name : undefined;

    return {
      id: first(p.id, p._id, i + 1) as string | number,
      slug,
      nameBn: name,
      category,
      categoryNameBn: String(
        first(p.categoryNameBn, p.category_name, categoryName, p.categoryName, 'পণ্য')
      ),
      categoryIcon: String(first(p.categoryIcon, p.icon, categoryIcons[category], '🛒')),
      unit: String(first(p.unit, p.unitBn, p.measurement, 'kg')),
      image: String(first(p.image, p.emoji, p.icon, categoryIcons[category], '🛒')),
      today,
      yesterday,
      lastWeek: num(first(p.lastWeek, p.last_week, p.weekPrice), yesterday),
      lastMonth: num(first(p.lastMonth, p.last_month, p.monthPrice), yesterday),
      change: {
        dir: ['up', 'down', 'flat'].includes(dir)
          ? dir
          : pct > 0
            ? 'up'
            : pct < 0
              ? 'down'
              : 'flat',
        pct: Math.abs(pct),
      },
      markets,
      description: String(first(p.description, p.summary, 'আজকের বাজারদরের সংক্ষিপ্ত বিবরণ।')),
    };
  });
}

export function normalizeCategories(raw: unknown): Category[] {
  const obj = raw as Record<string, unknown> | null;
  const rows = Array.isArray(raw)
    ? raw
    : Array.isArray(obj?.data)
      ? (obj.data as unknown[])
      : Array.isArray(obj?.categories)
        ? (obj.categories as unknown[])
        : [];

  return rows.map((item: unknown, i: number) => {
    const c = item as Record<string, unknown>;
    const slug = String(first(c.slug, c.id, `category-${i + 1}`));
    return {
      id: String(first(c.id, c.slug, i)),
      slug,
      nameBn: String(first(c.nameBn, c.name_bn, c.name, c.title, 'অন্যান্য')),
      icon: String(first(c.icon, c.emoji, categoryIcons[slug] || '🛒')),
    };
  });
}
