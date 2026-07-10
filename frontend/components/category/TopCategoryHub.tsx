import type { CatalogProduct, CategoryMeta } from "@/lib/catalog-data";
import SectionHead from "@/components/SectionHead";
import SubCategoryTiles from "./SubCategoryTiles";
import CategoryFooter from "./CategoryFooter";
import CatCard from "./CatCard";

export default function TopCategoryHub({
  category,
  previewProducts,
}: {
  category: CategoryMeta;
  previewProducts: CatalogProduct[];
}) {
  return (
    <section style={{ padding: "36px 0 72px" }}>
      <div className="v2-wrap">
        {category.children && category.children.length > 0 && (
          <>
            <SectionHead overline="Explore" title={`Shop ${category.title}`} />
            <SubCategoryTiles items={category.children} />
          </>
        )}

        {previewProducts.length > 0 && (
          <div style={{ marginTop: 60 }}>
            <SectionHead
              overline="Featured"
              title={`Popular in ${category.title}`}
              action="View all products →"
              actionHref={`/product-category/${category.slug}?view=all`}
            />
            <div className="v2-product-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 18 }}>
              {previewProducts.map((p) => (
                <CatCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

        <CategoryFooter category={category} />
      </div>
    </section>
  );
}
