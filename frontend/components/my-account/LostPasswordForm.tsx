"use client";

import { useState } from "react";
import Link from "next/link";

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.78rem",
  fontWeight: 600,
  color: "#45433E",
  marginBottom: 7,
};
const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1.5px solid #DEDBD3",
  borderRadius: 10,
  padding: "12px 14px",
  font: "inherit",
  fontSize: "0.9rem",
  background: "#fff",
  color: "var(--ink)",
};

export default function LostPasswordForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 46, height: 46, borderRadius: "50%", background: "var(--acc-soft)", color: "var(--acc-ink)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4h16v16H4z" fill="none" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        </div>
        <p style={{ color: "#45433E", fontSize: "0.92rem", lineHeight: 1.7 }}>
          If an account exists for <b>{email}</b>, we&rsquo;ve sent a link to reset your password. Please check your inbox.
        </p>
        <Link href="/login" style={{ display: "inline-block", marginTop: 18, color: "var(--mag-ink)", fontWeight: 600, fontSize: "0.88rem", textDecoration: "none" }}>
          ← Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (email.trim()) setSent(true);
      }}
    >
      <p style={{ color: "#77746D", fontSize: "0.88rem", lineHeight: 1.65, marginBottom: 20 }}>
        Enter the email address linked to your account and we&rsquo;ll send you a link to set a new password.
      </p>
      <div style={{ marginBottom: 18 }}>
        <label htmlFor="reset-email" style={labelStyle}>Email address</label>
        <input
          id="reset-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          style={inputStyle}
        />
      </div>
      <button type="submit" className="v2-btn-primary" style={{ width: "100%", justifyContent: "center" }}>
        Send reset link <span aria-hidden="true">→</span>
      </button>
      <p style={{ textAlign: "center", marginTop: 18, fontSize: "0.85rem", color: "#77746D" }}>
        Remembered it?{" "}
        <Link href="/login" style={{ color: "var(--mag-ink)", fontWeight: 600, textDecoration: "none" }}>
          Sign in
        </Link>
      </p>
    </form>
  );
}
