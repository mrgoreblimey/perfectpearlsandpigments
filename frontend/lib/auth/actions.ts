"use server";

/**
 * Server Actions for the account area. All run server-side only (secure place
 * for credentials), set/clear the session cookie, and return a `FormState`
 * consumed by `useActionState` in the client forms.
 */

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { activeProvider, getSession } from "./index";
import { writeSession, clearSession } from "./session";
import { mergeDeviceCartIntoAccount } from "@/lib/cart/actions";
import { emptyAddress } from "./types";
import type { Address } from "./types";

export interface FormState {
  error?: string;
  success?: string;
  fieldErrors?: Record<string, string>;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function safeRedirectPath(input: FormDataEntryValue | null): string {
  const v = typeof input === "string" ? input : "";
  // Allowlist local post-login destinations to avoid open-redirects.
  if (v.startsWith("/account") || v === "/checkout") return v;
  return "/account";
}

export async function loginAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const target = safeRedirectPath(formData.get("redirectTo"));

  const fieldErrors: Record<string, string> = {};
  if (!EMAIL_RE.test(email)) fieldErrors.email = "Enter a valid email address.";
  if (!password) fieldErrors.password = "Enter your password.";
  if (Object.keys(fieldErrors).length) return { fieldErrors };

  const result = await activeProvider().login(email, password);
  if (!result.ok || !result.session) {
    return { error: result.error ?? "Could not sign you in." };
  }
  await writeSession(result.session);
  await mergeDeviceCartIntoAccount(result.session, String(formData.get("deviceCart") ?? ""));
  redirect(target);
}

export async function registerAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const fieldErrors: Record<string, string> = {};
  if (!firstName) fieldErrors.firstName = "Enter your first name.";
  if (!lastName) fieldErrors.lastName = "Enter your last name.";
  if (!EMAIL_RE.test(email)) fieldErrors.email = "Enter a valid email address.";
  if (password.length < 8) fieldErrors.password = "Use at least 8 characters.";
  if (Object.keys(fieldErrors).length) return { fieldErrors };

  const result = await activeProvider().register({ email, password, firstName, lastName });
  if (!result.ok || !result.session) {
    return { error: result.error ?? "Could not create your account." };
  }
  await writeSession(result.session);
  await mergeDeviceCartIntoAccount(result.session, String(formData.get("deviceCart") ?? ""));
  redirect("/account");
}

export async function logoutAction(): Promise<void> {
  await clearSession();
  redirect("/login");
}

export async function updateAccountAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const session = await getSession();
  if (!session) redirect("/login");

  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();

  const fieldErrors: Record<string, string> = {};
  if (!firstName) fieldErrors.firstName = "Enter your first name.";
  if (!lastName) fieldErrors.lastName = "Enter your last name.";
  if (!EMAIL_RE.test(email)) fieldErrors.email = "Enter a valid email address.";
  if (Object.keys(fieldErrors).length) return { fieldErrors };

  const result = await activeProvider().updateAccount(session, { firstName, lastName, email });
  if (!result.ok) return { error: result.error ?? "Could not update your details." };

  if (result.user) {
    await writeSession({ ...session, user: result.user });
  }
  revalidatePath("/account");
  return { success: "Your details have been saved." };
}

export async function changePasswordAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const session = await getSession();
  if (!session) redirect("/login");

  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirm = String(formData.get("confirmPassword") ?? "");

  const fieldErrors: Record<string, string> = {};
  if (newPassword.length < 8) fieldErrors.newPassword = "Use at least 8 characters.";
  if (newPassword !== confirm) fieldErrors.confirmPassword = "Passwords do not match.";
  if (Object.keys(fieldErrors).length) return { fieldErrors };

  const result = await activeProvider().changePassword(session, { currentPassword, newPassword });
  if (!result.ok) return { error: result.error ?? "Could not change your password." };
  return { success: "Your password has been changed." };
}

function readAddress(formData: FormData): Address {
  return {
    firstName: String(formData.get("firstName") ?? "").trim(),
    lastName: String(formData.get("lastName") ?? "").trim(),
    company: String(formData.get("company") ?? "").trim(),
    address1: String(formData.get("address1") ?? "").trim(),
    address2: String(formData.get("address2") ?? "").trim(),
    city: String(formData.get("city") ?? "").trim(),
    state: String(formData.get("state") ?? "").trim(),
    postcode: String(formData.get("postcode") ?? "").trim(),
    country: String(formData.get("country") ?? "GB").trim() || "GB",
    phone: String(formData.get("phone") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim() || undefined,
  };
}

export async function updateAddressAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const session = await getSession();
  if (!session) redirect("/login");

  const kind = formData.get("kind") === "shipping" ? "shipping" : "billing";
  const address = { ...emptyAddress, ...readAddress(formData) };

  const fieldErrors: Record<string, string> = {};
  if (!address.firstName) fieldErrors.firstName = "Enter a first name.";
  if (!address.address1) fieldErrors.address1 = "Enter an address.";
  if (!address.city) fieldErrors.city = "Enter a town/city.";
  if (!address.postcode) fieldErrors.postcode = "Enter a postcode.";
  if (Object.keys(fieldErrors).length) return { fieldErrors };

  const result = await activeProvider().updateAddress(session, kind, address);
  if (!result.ok) return { error: result.error ?? "Could not save your address." };
  revalidatePath("/account/addresses");
  return { success: `Your ${kind} address has been saved.` };
}
