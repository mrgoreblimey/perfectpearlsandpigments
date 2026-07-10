import Header from "@/components/Header";
import Hero from "@/components/Hero";
import UspRow from "@/components/UspRow";
import Categories from "@/components/Categories";
import ProductSection from "@/components/ProductSection";
import Showcase from "@/components/Showcase";
import Stats from "@/components/Stats";
import Reviews from "@/components/Reviews";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { getHomeData } from "@/lib/wordpress";

export default async function Home() {
  const { nav, cats, bestSellers, newIn, reviews } = await getHomeData();

  return (
    <div>
      <Header nav={nav} />
      <Hero />
      <UspRow />
      <Categories cats={cats} />
      <ProductSection overline="Featured" title="Best sellers" products={bestSellers} />
      <Showcase />
      <ProductSection overline="Trending" title="New in" products={newIn} />
      <Stats />
      <Reviews reviews={reviews} />
      <Newsletter />
      <Footer />
      <CartDrawer />
    </div>
  );
}
