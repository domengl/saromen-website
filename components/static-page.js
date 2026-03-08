"use client";

import LanguageSwitcher, { useLanguage } from "@/components/language-switcher";

const TEXT = {
  sl: { shop: "Shop", top: "Top Hiti", discounts: "Popusti", news: "Novosti", blog: "Blog", contact: "Kontakt" },
  en: { shop: "Shop", top: "Top Hits", discounts: "Discounts", news: "New", blog: "Blog", contact: "Contact" },
  de: { shop: "Shop", top: "Top Hits", discounts: "Rabatte", news: "Neuheiten", blog: "Blog", contact: "Kontakt" }
};

export default function StaticPage({ title, subtitle, children }) {
  const [lang, setLang] = useLanguage("sl");
  const t = TEXT[lang] || TEXT.sl;

  return (
    <main className="mx-auto w-[min(1080px,92%)] py-10">
      <header className="panel p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <a href="/" className="inline-flex items-center">
            <img src="/assets/saromen-logo.png" alt="SAROMEN" className="h-12 w-auto rounded-lg border border-[var(--line)] bg-black/20 p-1" />
          </a>
          <LanguageSwitcher lang={lang} setLang={setLang} />
        </div>
        <nav className="mt-4 flex flex-wrap gap-3 text-xs uppercase tracking-[0.08em] text-[#dbc8ad]">
          <a href="/shop">{t.shop}</a>
          <a href="/top-hits">{t.top}</a>
          <a href="/popusti">{t.discounts}</a>
          <a href="/novosti">{t.news}</a>
          <a href="/blog">{t.blog}</a>
          <a href="/kontakt">{t.contact}</a>
          <a href="/faq">FAQ</a>
        </nav>
        <h1 className="display-font mt-4 text-5xl text-[var(--gold)]">{title}</h1>
        {subtitle ? <p className="mt-2 text-sm text-[#dbc8ad]">{subtitle}</p> : null}
      </header>
      <section className="panel mt-4 p-6 text-sm leading-8 text-[#dbc8ad]">{children}</section>
      <footer className="panel mt-4 p-6">
        <div className="grid gap-3 text-sm text-[#dbc8ad]">
          <p>
            <strong>Help & Support:</strong> <a href="/help" className="text-[var(--gold)]">Center</a>
          </p>
          <p>
            <strong>Policy:</strong> <a href="/policy/privacy" className="text-[var(--gold)]">Privacy</a>,{" "}
            <a href="/policy/terms" className="text-[var(--gold)]">Terms</a>,{" "}
            <a href="/policy/shipping" className="text-[var(--gold)]">Shipping</a>
          </p>
          <p>
            <strong>Placila:</strong> Visa, Mastercard, PayPal, Apple Pay, Google Pay
          </p>
          <p className="text-xs">Copyright (c) {new Date().getFullYear()} SAROMEN</p>
        </div>
      </footer>
    </main>
  );
}
