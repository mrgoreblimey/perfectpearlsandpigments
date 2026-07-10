import Link from "next/link";
import type { ReactNode } from "react";

interface SectionHeadProps {
  overline: string;
  title: string;
  action?: string;
  actionHref?: string;
  children?: ReactNode;
}

export default function SectionHead({ overline, title, action, actionHref = "#", children }: SectionHeadProps) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32, gap: 24 }}>
      <div>
        <div style={{ color: "var(--acc)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 10 }}>
          {overline}
        </div>
        <h2 style={{ fontSize: "clamp(1.6rem,2.6vw,2.15rem)", letterSpacing: "-0.025em" }}>{title}</h2>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, paddingBottom: 4 }}>
        {children}
        {action && (
          <Link href={actionHref} className="v2-link-btn">
            {action}
          </Link>
        )}
      </div>
    </div>
  );
}
