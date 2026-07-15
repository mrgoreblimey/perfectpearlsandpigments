"use client";

import { useEffect, useRef } from "react";

/**
 * Hidden field carrying the current localStorage cart into the login/register
 * server action, so it can be merged into the customer's saved cart on sign-in.
 *
 * Reads localStorage on mount AND again in a capture-phase submit listener, so
 * the value is fresh even if the cart changed while on the auth page.
 */
export default function DeviceCartField() {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const read = () => {
      try {
        if (ref.current) ref.current.value = window.localStorage.getItem("ppp-cart-v2") ?? "";
      } catch {
        // localStorage unavailable — nothing to merge.
      }
    };
    read();
    const form = ref.current?.form;
    // Capture phase runs before React serialises the form action's FormData.
    form?.addEventListener("submit", read, true);
    return () => form?.removeEventListener("submit", read, true);
  }, []);

  return <input ref={ref} type="hidden" name="deviceCart" defaultValue="" readOnly />;
}
