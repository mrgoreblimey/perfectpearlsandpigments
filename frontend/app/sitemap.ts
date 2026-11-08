import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { wpGetAllCategorySlugs, wpGetAllProductSlugs } from "@/lib/woo-catalog";

export const revalidate = 3600; // refresh hourly

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products] = await Promise.all([
    wpGetAllCategorySlugs().catch(() => []),
    wpGetAllProductSlugs().catch(() => []),
  ]);

  const staticPages: MetadataRoute.Sitemap = ["", "/about", "/contact", "/shipping", "/terms", "/privacy"].map((p) => ({
    url: `${SITE_URL}${p}`,
    changeFrequency: "weekly",
    priority: p === "" ? 1 : 0.5,
  }));

  const categoryPages: MetadataRoute.Sitemap = categories.map((slug) => ({
    url: `${SITE_URL}/product-category/${slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const productPages: MetadataRoute.Sitemap = products.map(({ slug, modified }) => ({
    url: `${SITE_URL}/product/${slug}`,
    lastModified: modified ? new Date(modified) : undefined,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages, ...productPages];
}
