"use client";

import { useState } from "react";
import Link from "next/link";
import { logoutAction } from "@/lib/auth/actions";
import LoginForm from "@/components/account/LoginForm";
import type { Viewer } from "@/lib/auth/types";

/**
 * Checkout account bar — the "usual" WooCommerce pattern:
 *  - signed in  → confirmation + sign out
 *  - guest      → collapsible "Returning customer? Log in" (prefills on return)
 * Either way the guest form below stays fully usable — login is optional.
 */
export default function CheckoutAccount({ viewer }: { viewer: Viewer | null }) {
  const [open, setOpen] = useState(false);

  if (viewer) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
          background: "#eaf7ef",
          border: "1px solid #b7e2c6",
          borderRadius: 10,
          padding: "12px 16px",
          marginBottom: 26,
        }}
      >
        <span style={{ fontSize: "0.85rem", color: "#1f7a45" }}>
          ✓ Signed in as <strong>{viewer.email}</strong> — your details are pre-filled.
        </span>
        <form action={logoutAction}>
          <button
            type="submit"
            style={{
              appearance: "none",
              border: "none",
              background: "none",
              cursor: "pointer",
              color: "#1f7a45",
              fontSize: "0.8rem",
              fontWeight: 600,
              textDecoration: "underline",
              fontFamily: "var(--font-lexend), sans-serif",
            }}
          >
            Sign out
          </button>
        </form>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid var(--line)",
        borderRadius: 10,
        padding: open ? "16px 18px 20px" : "13px 16px",
        marginBottom: 26,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <span style={{ fontSize: "0.85rem", color: "#55534E" }}>
          Returning customer?{" "}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            style={{
              appearance: "none",
              border: "none",
              background: "none",
              cursor: "pointer",
              color: "var(--acc)",
              fontSize: "0.85rem",
              fontWeight: 600,
              fontFamily: "var(--font-lexend), sans-serif",
              padding: 0,
            }}
          >
            {open ? "Hide login" : "Log in"}
          </button>{" "}
          for faster checkout.
        </span>
        <Link href="/register" style={{ fontSize: "0.8rem", color: "#8A877F", textDecoration: "none", whiteSpace: "nowrap" }}>
          Create account
        </Link>
      </div>

      {open && (
        <div style={{ marginTop: 16, maxWidth: 400 }}>
          <LoginForm redirectTo="/checkout" />
        </div>
      )}
    </div>
  );
}
