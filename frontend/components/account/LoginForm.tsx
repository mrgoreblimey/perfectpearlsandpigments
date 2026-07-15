"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction, type FormState } from "@/lib/auth/actions";
import Field from "./Field";
import SubmitButton from "./SubmitButton";
import DeviceCartField from "./DeviceCartField";

export default function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const [state, action] = useActionState<FormState, FormData>(loginAction, {});

  return (
    <form action={action} noValidate>
      {state.error && <div className="acct-alert acct-alert-error">{state.error}</div>}
      <input type="hidden" name="redirectTo" value={redirectTo ?? "/account"} />
      <DeviceCartField />

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Field
          label="Email address"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          error={state.fieldErrors?.email}
        />
        <Field
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          error={state.fieldErrors?.password}
        />
        <div style={{ marginTop: 4 }}>
          <SubmitButton pendingLabel="Signing in…">Sign in →</SubmitButton>
        </div>
      </div>

      <p style={{ marginTop: 22, fontSize: "0.86rem", color: "#77746D", textAlign: "center" }}>
        New here?{" "}
        <Link href="/register" style={{ color: "var(--acc)", fontWeight: 600, textDecoration: "none" }}>
          Create an account
        </Link>
      </p>
    </form>
  );
}
