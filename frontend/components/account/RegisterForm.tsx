"use client";

import Link from "next/link";
import { useActionState } from "react";
import { registerAction, type FormState } from "@/lib/auth/actions";
import Field from "./Field";
import SubmitButton from "./SubmitButton";
import DeviceCartField from "./DeviceCartField";

export default function RegisterForm() {
  const [state, action] = useActionState<FormState, FormData>(registerAction, {});

  return (
    <form action={action} noValidate>
      {state.error && <div className="acct-alert acct-alert-error">{state.error}</div>}
      <DeviceCartField />

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div className="chk-row2">
          <Field label="First name" name="firstName" autoComplete="given-name" placeholder="Alex" error={state.fieldErrors?.firstName} />
          <Field label="Last name" name="lastName" autoComplete="family-name" placeholder="Rivera" error={state.fieldErrors?.lastName} />
        </div>
        <Field label="Email address" name="email" type="email" autoComplete="email" placeholder="you@example.com" error={state.fieldErrors?.email} />
        <Field label="Password" name="password" type="password" autoComplete="new-password" placeholder="At least 8 characters" error={state.fieldErrors?.password} />
        <div style={{ marginTop: 4 }}>
          <SubmitButton pendingLabel="Creating account…">Create account →</SubmitButton>
        </div>
      </div>

      <p style={{ marginTop: 22, fontSize: "0.86rem", color: "#77746D", textAlign: "center" }}>
        Already have an account?{" "}
        <Link href="/login" style={{ color: "var(--acc)", fontWeight: 600, textDecoration: "none" }}>
          Sign in
        </Link>
      </p>
    </form>
  );
}
