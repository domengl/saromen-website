"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "saromen_lang";
export const LANG_OPTIONS = [
  { code: "sl", label: "SL" },
  { code: "en", label: "EN" },
  { code: "de", label: "DE" }
];

export function useLanguage(defaultLang = "sl") {
  const [lang, setLang] = useState(defaultLang);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && LANG_OPTIONS.some((item) => item.code === stored)) {
      setLang(stored);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  return [lang, setLang];
}

export default function LanguageSwitcher({ lang, setLang, className = "" }) {
  const label = lang === "en" ? "Language" : lang === "de" ? "Sprache" : "Jezik";
  return (
    <label className={`inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[rgba(255,255,255,0.02)] px-3 py-2 text-xs uppercase tracking-[0.08em] ${className}`}>
      <span className="text-[#dbc8ad]">{label}</span>
      <select
        value={lang}
        onChange={(event) => setLang(event.target.value)}
        className="bg-transparent text-[var(--cream)] outline-none"
        aria-label="Language selector"
      >
        {LANG_OPTIONS.map((item) => (
          <option key={item.code} value={item.code} className="bg-[#181512]">
            {item.label}
          </option>
        ))}
      </select>
    </label>
  );
}
