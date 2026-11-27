import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { wpGetAllCategorySlugs, wpGetAllProductSlugs } from "@/lib/woo-catalog";

export const revalidate = 3600; // refresh hourly

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products] = await Promise.all([
    wpGetAllCategorySlugs().catch(() => []),
    wpGetAllProductSlugs().catch(() => []),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    "", "/store", "/about-us", "/contact-us", "/shipping", "/returns", "/help-advice",
    "/wholesale", "/affiliates", "/blog", "/terms-and-conditions", "/privacy-policy", "/cookie-policy-uk",
  ].map((p) => ({
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
    url: `${SITE_URL}/products/${slug}`,
    lastModified: modified ? new Date(modified) : undefined,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages, ...productPages];
}
