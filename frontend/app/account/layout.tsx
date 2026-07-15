import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AccountNav from "@/components/account/AccountNav";
import { getHomeData } from "@/lib/wordpress";
import { requireSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "My account — Perfect Pearls & Pigments",
};

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  // Gate on initial load; proxy.ts guards client navigations into /account/*.
  const [{ nav }, session] = await Promise.all([getHomeData(), requireSession()]);

  return (
    <div>
      <Header nav={nav} />
      <section style={{ padding: "40px 0 80px", minHeight: "60vh" }}>
        <div className="v2-wrap">
          <div style={{ marginBottom: 30 }}>
            <div style={{ color: "var(--acc)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 10 }}>
              My account
            </div>
            <h1 style={{ fontSize: "clamp(1.7rem,2.8vw,2.2rem)", letterSpacing: "-0.03em" }}>
              Hi {session.user.firstName || session.user.displayName}
            </h1>
          </div>
          <div className="acct-layout">
            <AccountNav />
            <div>{children}</div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
