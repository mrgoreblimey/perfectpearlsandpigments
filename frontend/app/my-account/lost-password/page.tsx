import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LostPasswordForm from "@/components/my-account/LostPasswordForm";
import { getHomeData } from "@/lib/wordpress";

export const metadata: Metadata = {
  title: "Reset your password — Perfect Pearls & Pigments",
  alternates: { canonical: "/my-account/lost-password" },
};

export default async function LostPasswordPage() {
  const { nav } = await getHomeData();
  return (
    <div>
      <Header nav={nav} />
      <section style={{ padding: "64px 0 96px", minHeight: "60vh" }}>
        <div className="v2-wrap">
          <div className="auth-wrap">
            <div style={{ textAlign: "center", marginBottom: 30 }}>
              <div style={{ color: "var(--acc)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>
                My account
              </div>
              <h1 style={{ fontSize: "clamp(1.9rem,3vw,2.4rem)", letterSpacing: "-0.03em" }}>Reset your password</h1>
            </div>
            <div className="chk-card" style={{ padding: "30px 30px 34px" }}>
              <LostPasswordForm />
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
