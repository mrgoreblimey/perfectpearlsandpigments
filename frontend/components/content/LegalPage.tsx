"use client";

import { useEffect, useState } from "react";

type ProseItem = string | { list: string[] } | { callout: string };

export interface LegalSection {
  id: string;
  title: string;
  body: ProseItem[];
}

function ProseBody({ items }: { items: ProseItem[] }) {
  return (
    <>
      {items.map((item, i) => {
        if (typeof item === "string") return <p key={i}>{item}</p>;
        if ("list" in item)
          return (
            <ul key={i}>
              {item.list.map((li, j) => (
                <li key={j}>{li}</li>
              ))}
            </ul>
          );
        return (
          <div key={i} className="prose-callout">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--acc)" strokeWidth="2" style={{ flexShrink: 0, marginTop: 3 }}>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{item.callout}</span>
          </div>
        );
      })}
    </>
  );
}

export default function LegalPage({
  overline, title, intro, updated, badge, sections,
}: {
  overline: string;
  title: string;
  intro?: string;
  updated?: string;
  badge?: string;
  sections: LegalSection[];
}) {
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-25% 0px -65% 0px" },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [sections]);

  return (
    <section style={{ padding: "56px 0 88px" }}>
      <div className="v2-wrap">
        <div style={{ maxWidth: 720, marginBottom: 48 }}>
          <div style={{ color: "var(--acc)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 14 }}>{overline}</div>
          <h1 style={{ fontSize: "clamp(2rem,3.6vw,2.8rem)", letterSpacing: "-0.03em", marginBottom: 16 }}>{title}</h1>
          {intro && <p style={{ color: "#6E6B64", fontSize: "0.98rem", lineHeight: 1.75, fontWeight: 300, marginBottom: 16 }}>{intro}</p>}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            {updated && (
              <span style={{ display: "inline-block", background: "#fff", border: "1px solid var(--line)", borderRadius: 100, padding: "7px 15px", fontSize: "0.73rem", fontWeight: 500, color: "#8A877F" }}>
                Last updated · {updated}
              </span>
            )}
            {badge && (
              <span style={{ display: "inline-block", background: "var(--acc)", borderRadius: 100, padding: "7px 15px", fontSize: "0.73rem", fontWeight: 600, color: "#17150F" }}>
                {badge}
              </span>
            )}
          </div>
        </div>

        <div className="legal-layout">
          <nav className="legal-toc" aria-label="On this page">
            <div style={{ color: "#A5A29A", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>On this page</div>
            <div style={{ display: "flex", flexDirection: "column", borderLeft: "1px solid var(--line)", paddingLeft: 18 }}>
              {sections.map((s) => (
                <a key={s.id} href={`#${s.id}`} className={`legal-toc-link${active === s.id ? " active" : ""}`}>
                  <span className="toc-dot" />
                  {s.title}
                </a>
              ))}
            </div>
          </nav>

          <div className="prose">
            {sections.map((s) => (
              <section key={s.id} id={s.id}>
                <h2>{s.title}</h2>
                <ProseBody items={s.body} />
              </section>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
