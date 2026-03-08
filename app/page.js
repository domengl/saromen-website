"use client";

import LanguageSwitcher, { useLanguage } from "@/components/language-switcher";

const TEXT = {
  sl: {
    title: "SAROMEN premium candle store",
    subtitle: "Home je povzetek ponudbe. Za nakup pojdi v Shop.",
    shop: "V trgovino",
    top: "Top hiti",
    discounts: "Popusti",
    news: "Novosti",
    blog: "Blog",
    contact: "Kontakt",
    faq: "FAQ",
    promo1: "AKCIJA -25%",
    promo2: "NOVO V KOLEKCIJI",
    promo3: "TOP HITI TEDNA",
    disclaimer: "TESTNA SPLETNA STRAN - pravno ne odgovarjamo za nastale tezave."
  },
  en: {
    title: "SAROMEN premium candle store",
    subtitle: "Home is a summary. Go to Shop for full purchase flow.",
    shop: "Shop",
    top: "Top hits",
    discounts: "Discounts",
    news: "New",
    blog: "Blog",
    contact: "Contact",
    faq: "FAQ",
    promo1: "SALE -25%",
    promo2: "NEW ARRIVALS",
    promo3: "WEEKLY TOP HITS",
    disclaimer: "TEST WEBSITE - we are not liable for any issues."
  },
  de: {
    title: "SAROMEN premium candle store",
    subtitle: "Home ist nur die Ubersicht. Fur Einkaufe gehe zu Shop.",
    shop: "Shop",
    top: "Top Hits",
    discounts: "Rabatte",
    news: "Neuheiten",
    blog: "Blog",
    contact: "Kontakt",
    faq: "FAQ",
    promo1: "AKTION -25%",
    promo2: "NEUHEITEN",
    promo3: "TOP HITS DER WOCHE",
    disclaimer: "TEST-WEBSITE - keine Haftung fur Probleme."
  }
};

export default function HomePage() {
  const [lang, setLang] = useLanguage("sl");
  const t = TEXT[lang] || TEXT.sl;

  return (
    <main className="mx-auto w-[min(1180px,92%)] py-8">
      <div className="mb-3 rounded-xl border border-[var(--line)] bg-[#2d1f14] p-3 text-center text-xs uppercase tracking-[0.09em] text-[#ffd9a5]">
        {t.disclaimer}
      </div>
      <header className="panel p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <img src="/assets/saromen-logo.png" alt="SAROMEN logo" className="h-14 w-auto rounded-lg border border-[var(--line)] bg-black/25 p-1" />
          <LanguageSwitcher lang={lang} setLang={setLang} />
        </div>
        <h1 className="display-font text-6xl text-[var(--gold)]">{t.title}</h1>
        <p className="mt-2 text-sm text-[#dbc8ad]">{t.subtitle}</p>
        <nav className="mt-5 flex flex-wrap gap-2">
          <a href="/shop" className="pill-btn border-[var(--gold)] bg-[var(--gold)] text-[#2a1a10]">{t.shop}</a>
          <a href="/top-hits" className="pill-btn">{t.top}</a>
          <a href="/popusti" className="pill-btn">{t.discounts}</a>
          <a href="/novosti" className="pill-btn">{t.news}</a>
          <a href="/blog" className="pill-btn">{t.blog}</a>
          <a href="/kontakt" className="pill-btn">{t.contact}</a>
          <a href="/faq" className="pill-btn">{t.faq}</a>
        </nav>
      </header>

      <section className="mt-4 grid gap-4 md:grid-cols-3">
        <article className="panel overflow-hidden">
          <div className="h-52 bg-[linear-gradient(145deg,#8c622f,#3d2a17)]" />
          <div className="p-4">
            <p className="text-xs uppercase tracking-[0.1em] text-[#f0c189]">{t.promo1}</p>
            <p className="mt-2 text-sm text-[#dbc8ad]">Weekend bundle in akcijske cene v kategoriji popustov.</p>
          </div>
        </article>
        <article className="panel overflow-hidden">
          <div className="h-52 bg-[linear-gradient(145deg,#5f4e3a,#1f1812)]" />
          <div className="p-4">
            <p className="text-xs uppercase tracking-[0.1em] text-[#f0c189]">{t.promo2}</p>
            <p className="mt-2 text-sm text-[#dbc8ad]">Nova linija svec, dodatkov in personalizacijskih paketov.</p>
          </div>
        </article>
        <article className="panel overflow-hidden">
          <div className="h-52 bg-[linear-gradient(145deg,#b48a4d,#2d2116)]" />
          <div className="p-4">
            <p className="text-xs uppercase tracking-[0.1em] text-[#f0c189]">{t.promo3}</p>
            <p className="mt-2 text-sm text-[#dbc8ad]">Najbolj prodajani izdelki in izpostavljene kolekcije.</p>
          </div>
        </article>
      </section>
    </main>
  );
}
