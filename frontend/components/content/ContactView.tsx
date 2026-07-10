"use client";

import { useState, type ReactNode } from "react";

function InfoRow({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="contact-info-row">
      <div style={{ width: 38, height: 38, borderRadius: 10, background: "#F1EFEA", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#17150F" }}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ color: "#8A877F", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: "0.88rem", lineHeight: 1.65, color: "#3A3833" }}>{children}</div>
      </div>
    </div>
  );
}

export default function ContactView() {
  const [sent, setSent] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire to an email/CRM endpoint. For now this mirrors the design's
    // optimistic confirmation.
    if (name && email && message) setSent(true);
  };

  return (
    <section style={{ padding: "56px 0 80px" }}>
      <div className="v2-wrap" style={{ maxWidth: 1180 }}>
        <div style={{ maxWidth: 620, marginBottom: 40 }}>
          <div style={{ color: "var(--acc)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 14 }}>Contact</div>
          <h1 style={{ fontSize: "clamp(2rem,3.6vw,2.8rem)", letterSpacing: "-0.03em", marginBottom: 16 }}>Get in touch</h1>
          <p style={{ color: "#6E6B64", fontSize: "0.98rem", lineHeight: 1.75, fontWeight: 300 }}>
            Got some questions, or need some help with a purchase? Contact us via phone or e-mail, or fill in the form and one of the team will get back to you.
          </p>
        </div>

        <div className="contact-layout">
          {/* Form */}
          <div className="chk-card" style={{ padding: "30px 32px" }}>
            {sent ? (
              <div style={{ textAlign: "center", padding: "60px 0" }}>
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: "var(--acc)", margin: "0 auto 18px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#17150F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h2 style={{ fontSize: "1.15rem", marginBottom: 8 }}>Message sent</h2>
                <p style={{ color: "#8A877F", fontSize: "0.86rem", marginBottom: 22 }}>Thanks — one of the team will get back to you shortly.</p>
                <button className="v2-link-btn" onClick={() => setSent(false)}>Send another message</button>
              </div>
            ) : (
              <form style={{ display: "flex", flexDirection: "column", gap: 16 }} onSubmit={submit}>
                <div className="chk-row2">
                  <div>
                    <label className="chk-label">Name</label>
                    <input className="chk-input" placeholder="Your name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div>
                    <label className="chk-label">Email address</label>
                    <input className="chk-input" type="email" placeholder="you@example.com" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="chk-label">What&apos;s it about?</label>
                  <select className="chk-select" defaultValue="General enquiry">
                    {["General enquiry", "Help with an order", "Product advice", "Wholesale", "Something else"].map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="chk-label">Message</label>
                  <textarea className="chk-input" rows={6} placeholder="How can we help?" style={{ resize: "vertical", minHeight: 130 }} value={message} onChange={(e) => setMessage(e.target.value)} />
                </div>
                <button type="submit" className="v2-btn-primary" style={{ alignSelf: "flex-start" }}>
                  Send message <span aria-hidden="true">→</span>
                </button>
              </form>
            )}
          </div>

          {/* Details */}
          <div>
            <div className="chk-card" style={{ padding: "10px 26px" }}>
              <InfoRow label="Call us" icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>}>
                <a href="tel:+441206645160" style={{ fontWeight: 500, textDecoration: "none", color: "inherit" }}>+44 (0)1206 645160</a>
              </InfoRow>
              <InfoRow label="Email us" icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>}>
                <a href="mailto:info@perfectpearlsandpigments.co.uk" style={{ fontWeight: 500, wordBreak: "break-all", textDecoration: "none", color: "inherit" }}>info@perfectpearlsandpigments.co.uk</a>
              </InfoRow>
              <InfoRow label="Find us" icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>}>
                Perfect Pearls &amp; Pigments<br />Brampton Hall Farm, Little Bentley<br />Colchester CO7 8TA
              </InfoRow>
              <InfoRow label="Working hours" icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>}>
                Mon – Fri: 09:00 to 17:00
              </InfoRow>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <a href="https://www.instagram.com/perfectpearlsandpigments/" target="_blank" rel="noopener" aria-label="Instagram" className="v2-social-btn" style={{ color: "#8A877F", borderColor: "var(--line)", textDecoration: "none" }}>IG</a>
              <a href="https://www.facebook.com/PerfectPearlsPigments/" target="_blank" rel="noopener" aria-label="Facebook" className="v2-social-btn" style={{ color: "#8A877F", borderColor: "var(--line)", textDecoration: "none" }}>FB</a>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 40, borderRadius: "calc(var(--r) + 4px)", overflow: "hidden", border: "1px solid var(--line)", height: 380, background: "#F1EFEA" }}>
          <iframe
            title="Map — Perfect Pearls & Pigments, Brampton Hall Farm, Little Bentley, Colchester"
            src="https://maps.google.com/maps?q=PERFECT%20PEARLS%20AND%20PIGMENTS&t=m&z=14&output=embed&iwloc=near"
            style={{ width: "100%", height: "100%", border: "none", display: "block" }}
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
