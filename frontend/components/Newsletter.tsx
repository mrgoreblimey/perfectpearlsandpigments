"use client";

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <section style={{ padding: "8px 20px 56px" }}>
      <div className="v2-wrap" style={{ padding: 0 }}>
        <div
          style={{
            background: "#0D0D0D", borderRadius: "calc(var(--r) + 8px)",
            padding: "clamp(48px,5vw,72px) 32px", textAlign: "center",
          }}
        >
          <div style={{ maxWidth: 520, margin: "0 auto" }}>
            <div style={{ color: "var(--acc)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 14 }}>
              Stay in the know
            </div>
            <h3 style={{ color: "#fff", fontSize: "clamp(1.5rem,2.6vw,2rem)", letterSpacing: "-0.025em", marginBottom: 12 }}>
              New drops. First.
            </h3>
            <p style={{ color: "#77746D", fontSize: "0.88rem", lineHeight: 1.75, marginBottom: 32, fontWeight: 300 }}>
              Exclusive access to new pigment launches, offers and colour inspiration.
            </p>
            {done ? (
              <div style={{ color: "var(--acc)", fontWeight: 600 }}>✓ You&apos;re in. Welcome to the family.</div>
            ) : (
              <form
                style={{ display: "flex", maxWidth: 430, margin: "0 auto", gap: 8 }}
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email) setDone(true);
                }}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  aria-label="Email address"
                  style={{
                    flex: 1, padding: "13px 18px", background: "#1A1A1A",
                    border: "1px solid #2C2C2C", borderRadius: 10,
                    color: "#fff", fontSize: "0.88rem", fontFamily: "inherit", outline: "none",
                  }}
                />
                <button type="submit" className="v2-btn-primary" style={{ padding: "13px 24px" }}>
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
