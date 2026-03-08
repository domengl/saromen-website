"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "saromen_cookie_consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const value = localStorage.getItem(STORAGE_KEY);
    if (!value) {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-50 w-[min(980px,94%)] -translate-x-1/2 rounded-2xl border border-[var(--line)] bg-[#1f1813] p-4 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[#e6d5bc]">
          Stran uporablja piskotke za kosarico, prijavo in analitiko. Z nadaljevanjem uporabe se strinjas z uporabo piskotkov.
        </p>
        <div className="flex gap-2">
          <a href="/policy/privacy" className="pill-btn">
            Policy
          </a>
          <button
            className="pill-btn border-[var(--gold)] bg-[var(--gold)] text-[#2b1a10]"
            onClick={() => {
              localStorage.setItem(STORAGE_KEY, "accepted");
              setVisible(false);
            }}
          >
            Sprejmi
          </button>
        </div>
      </div>
    </div>
  );
}
