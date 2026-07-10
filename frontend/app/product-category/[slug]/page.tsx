import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import CategoryBrowser from "@/components/category/CategoryBrowser";
import TopCategoryHub from "@/components/category/TopCategoryHub";
import { getHomeData, getCategory, getCategoryProducts } from "@/lib/wordpress";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);
  return {
    title: `${category.title} — Perfect Pearls & Pigments`,
    description: category.description,
  };
}

const HUB_PREVIEW_COUNT = 8;

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ view?: string }>;
}) {
  const { slug } = await params;
  const { view } = await searchParams;
  const [{ nav }, category, products] = await Promise.all([
    getHomeData(),
    getCategory(slug),
    getCategoryProducts(slug),
  ]);

  // Top-level categories (those with sub-categories) get the hub template,
  // unless the visitor asked to shop all products (?view=all).
  const isTopLevel = (category.children?.length ?? 0) > 0;
  const showHub = isTopLevel && view !== "all";
  const headerCount = category.productCount ?? products.length;

  return (
    <div>
      <Header nav={nav} />

      {/* Breadcrumb + category header */}
      <section style={{ background: "#fff", borderBottom: "1px solid var(--line)" }}>
        <div className="v2-wrap" style={{ padding: "26px 32px 34px" }}>
          <nav style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 22, fontSize: "0.76rem", flexWrap: "wrap" }}>
            {category.breadcrumb.map((c, i, a) => (
              <span key={c} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Link
                  href={i === 0 ? "/" : "#"}
                  style={{ color: i === a.length - 1 ? "#17150F" : "#9A968D", fontWeight: i === a.length - 1 ? 600 : 400, textDecoration: "none" }}
                >
                  {c}
                </Link>
                {i < a.length - 1 && <span style={{ color: "#CDC9C0" }}>/</span>}
              </span>
            ))}
          </nav>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
            <div style={{ maxWidth: 640 }}>
              <div style={{ color: "var(--acc)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>{category.overline}</div>
              <h1 style={{ fontSize: "clamp(2rem,3.6vw,3rem)", letterSpacing: "-0.03em", lineHeight: 1.02, marginBottom: 16 }}>{category.title}</h1>
              <p style={{ color: "#77746D", fontSize: "0.95rem", lineHeight: 1.75, fontWeight: 300, maxWidth: 560 }}>{category.description}</p>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontSize: "2.6rem", fontWeight: 700, fontFamily: "var(--font-archivo), sans-serif", letterSpacing: "-0.04em", lineHeight: 1 }}>{headerCount}</div>
              <div style={{ color: "#9A968D", fontSize: "0.72rem", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 4 }}>Products</div>
            </div>
          </div>
        </div>
      </section>

      {showHub ? (
        <TopCategoryHub category={category} previewProducts={products.slice(0, HUB_PREVIEW_COUNT)} />
      ) : (
        <CategoryBrowser products={products} category={category} />
      )}

      <Footer />
      <CartDrawer />
    </div>
  );
}
