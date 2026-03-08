"use client";

import { useEffect, useMemo, useState } from "react";
import LanguageSwitcher, { useLanguage } from "@/components/language-switcher";

const TRANSLATIONS = {
  sl: {
    all: "Vse",
    navShop: "Spletna trgovina",
    navTopHits: "Top hiti",
    navDiscounts: "Popusti",
    navNews: "Novosti",
    navBlog: "Blog",
    navContact: "Kontakt",
    navPersonalized: "Personalizacija",
    navDeals: "Posebne ugodnosti",
    login: "Prijava",
    logout: "Odjava",
    profile: "Profil",
    cart: "Kosarica",
    close: "Zapri",
    cartEmpty: "Kosarica je prazna.",
    remove: "Odstrani",
    coupon: "Kupon",
    apply: "Uporabi",
    clear: "Pocisti",
    discount: "Popust",
    shipping: "Postnina",
    total: "Skupaj",
    subtotal: "Vmesni znesek",
    addToCart: "Dodaj v kosarico",
    unavailable: "Ni na voljo",
    preOrder: (days) => `Prednaroci (${days} dni)`,
    stock: (amount) => `Na zalogi: ${amount} kos`,
    outOfStock: (days) => `Ni na zalogi. Dobava: ${days} dni.`,
    personalizedAdded: "Personalizirana sveca je dodana v kosarico.",
    checkoutLogin: "Za checkout se prijavi v profil.",
    checkoutLoading: "Pripravljam checkout...",
    checkoutFailed: "Checkout ni uspel.",
    couponMissing: "Kupon ne obstaja.",
    couponMin: (amount) => `Minimalni znesek za kupon je ${amount}.`,
    couponApplied: (code, percent) => `Kupon ${code} aktiviran (-${percent}%).`,
    testTitle: "TESTNA SPLETNA STRAN",
    legal:
      "Pravno obvestilo: ne odgovarjamo za nastale tezave, napake ali posledice uporabe te testne spletne strani.",
    blackFriday: "Black Friday",
    halloween: "Halloween",
    classic: "Classic"
  },
  en: {
    all: "All",
    navShop: "Shop",
    navTopHits: "Top hits",
    navDiscounts: "Discounts",
    navNews: "New",
    navBlog: "Blog",
    navContact: "Contact",
    navPersonalized: "Personalization",
    navDeals: "Special deals",
    login: "Login",
    logout: "Logout",
    profile: "Profile",
    cart: "Cart",
    close: "Close",
    cartEmpty: "Cart is empty.",
    remove: "Remove",
    coupon: "Coupon",
    apply: "Apply",
    clear: "Clear",
    discount: "Discount",
    shipping: "Shipping",
    total: "Total",
    subtotal: "Subtotal",
    addToCart: "Add to cart",
    unavailable: "Unavailable",
    preOrder: (days) => `Pre-order (${days} days)`,
    stock: (amount) => `In stock: ${amount} pcs`,
    outOfStock: (days) => `Out of stock. ETA: ${days} days.`,
    personalizedAdded: "Personalized candle was added to cart.",
    checkoutLogin: "Please login before checkout.",
    checkoutLoading: "Preparing checkout...",
    checkoutFailed: "Checkout failed.",
    couponMissing: "Coupon does not exist.",
    couponMin: (amount) => `Minimum amount for coupon is ${amount}.`,
    couponApplied: (code, percent) => `Coupon ${code} applied (-${percent}%).`,
    testTitle: "TEST WEBSITE",
    legal:
      "Legal notice: this is a test website. We are not responsible for issues, errors, or consequences.",
    blackFriday: "Black Friday",
    halloween: "Halloween",
    classic: "Classic"
  },
  de: {
    all: "Alle",
    navShop: "Shop",
    navTopHits: "Top Hits",
    navDiscounts: "Rabatte",
    navNews: "Neuheiten",
    navBlog: "Blog",
    navContact: "Kontakt",
    navPersonalized: "Personalisierung",
    navDeals: "Sonderangebote",
    login: "Anmelden",
    logout: "Abmelden",
    profile: "Profil",
    cart: "Warenkorb",
    close: "Schliessen",
    cartEmpty: "Warenkorb ist leer.",
    remove: "Entfernen",
    coupon: "Gutschein",
    apply: "Anwenden",
    clear: "Leeren",
    discount: "Rabatt",
    shipping: "Versand",
    total: "Gesamt",
    subtotal: "Zwischensumme",
    addToCart: "In den Warenkorb",
    unavailable: "Nicht verfugbar",
    preOrder: (days) => `Vorbestellen (${days} Tage)`,
    stock: (amount) => `Auf Lager: ${amount} Stk`,
    outOfStock: (days) => `Nicht auf Lager. Lieferzeit: ${days} Tage.`,
    personalizedAdded: "Personalisierte Kerze wurde in den Warenkorb gelegt.",
    checkoutLogin: "Bitte vor Checkout einloggen.",
    checkoutLoading: "Checkout wird vorbereitet...",
    checkoutFailed: "Checkout fehlgeschlagen.",
    couponMissing: "Gutschein existiert nicht.",
    couponMin: (amount) => `Mindestbetrag fur Gutschein ist ${amount}.`,
    couponApplied: (code, percent) => `Gutschein ${code} aktiviert (-${percent}%).`,
    testTitle: "TEST-WEBSITE",
    legal:
      "Rechtlicher Hinweis: Dies ist eine Testseite. Wir haften nicht fur Probleme, Fehler oder Folgen.",
    blackFriday: "Black Friday",
    halloween: "Halloween",
    classic: "Classic"
  }
};

const CATEGORY_LABELS = {
  "Scented Candles": { sl: "Disavne svece", en: "Scented candles", de: "Duftkerzen" },
  "Decor Candles": { sl: "Dekorativne svece", en: "Decor candles", de: "Dekokerzen" },
  "Fashion Candles": { sl: "Modni dodatek", en: "Fashion candles", de: "Fashion Kerzen" },
  "Limited Editions": { sl: "Limitirane kolekcije", en: "Limited editions", de: "Limitierte Editionen" },
  Personalization: { sl: "Personalizacija", en: "Personalization", de: "Personalisierung" },
  Accessories: { sl: "Dodatki", en: "Accessories", de: "Accessoires" },
  "Beauty Trays": { sl: "Beauty pladnji", en: "Beauty trays", de: "Beauty Tabletts" },
  Merch: { sl: "Majice in puloverji", en: "Shirts and hoodies", de: "Shirts und Hoodies" }
};

function categoryLabel(category, lang) {
  return CATEGORY_LABELS[category]?.[lang] || category;
}

function formatPrice(value) {
  return `EUR ${Number(value || 0).toFixed(2)}`;
}

function hashCode(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function productImage(product) {
  const hue = hashCode(`${product.name}-${product.scent}`) % 360;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='720' height='720'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='hsl(${hue},42%,20%)'/><stop offset='100%' stop-color='hsl(${(hue + 34) % 360},50%,12%)'/></linearGradient></defs><rect width='720' height='720' fill='url(#g)'/><ellipse cx='360' cy='190' rx='34' ry='60' fill='#f8d39d'/><rect x='334' y='238' width='52' height='246' rx='22' fill='#d7b07b'/><text x='360' y='565' font-size='58' text-anchor='middle' fill='#f3d6ae' font-family='Cormorant Garamond,serif'>${product.name}</text><text x='360' y='615' font-size='24' text-anchor='middle' fill='#f7e7ce' font-family='Manrope,sans-serif'>${product.scent}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function effectivePrice(product) {
  if (!product.salePercent) return product.price;
  return product.price * (1 - product.salePercent / 100);
}

function seasonDiscount(season) {
  if (season === "blackfriday") return 15;
  if (season === "halloween") return 8;
  return 0;
}

function detectSeason() {
  const month = new Date().getMonth() + 1;
  if (month === 11) return "blackfriday";
  if (month === 10) return "halloween";
  return "classic";
}

export default function Storefront({ shopOnly = false }) {
  const [lang, setLang] = useLanguage("sl");
  const t = TRANSLATIONS[lang] || TRANSLATIONS.sl;
  const [products, setProducts] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [category, setCategory] = useState("all");
  const [season, setSeason] = useState("classic");
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [activeCoupon, setActiveCoupon] = useState(null);
  const [couponMessage, setCouponMessage] = useState("");
  const [checkoutMessage, setCheckoutMessage] = useState("");
  const [user, setUser] = useState(null);
  const [customMessage, setCustomMessage] = useState("");
  const [customPreview, setCustomPreview] = useState({
    text: "",
    scent: "Amber Vanilla",
    base: "Signature Jar",
    logoUrl: ""
  });

  useEffect(() => {
    return () => {
      if (customPreview.logoUrl) {
        URL.revokeObjectURL(customPreview.logoUrl);
      }
    };
  }, [customPreview.logoUrl]);

  useEffect(() => {
    const stored = localStorage.getItem("saromen_season");
    setSeason(stored || detectSeason());
  }, []);

  useEffect(() => {
    localStorage.setItem("saromen_season", season);
  }, [season]);

  useEffect(() => {
    const load = async () => {
      const [productsRes, couponsRes, meRes] = await Promise.all([fetch("/api/products"), fetch("/api/coupons"), fetch("/api/auth/me")]);
      const productsJson = await productsRes.json();
      const couponsJson = await couponsRes.json();
      const meJson = await meRes.json();
      setProducts(productsJson.items || []);
      setCoupons(couponsJson.items || []);
      setUser(meJson.user || null);
    };
    load();
  }, []);

  const categories = useMemo(() => ["all", ...new Set(products.map((item) => item.category))], [products]);
  const topHits = useMemo(() => products.filter((item) => item.isTop), [products]);
  const discounts = useMemo(() => products.filter((item) => item.salePercent > 0), [products]);
  const novosti = useMemo(() => products.filter((item) => item.isNew), [products]);
  const catalog = useMemo(
    () => (category === "all" ? products : products.filter((item) => item.category === category)),
    [category, products]
  );
  const seasonExtra = useMemo(() => seasonDiscount(season), [season]);

  const totals = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const discount = activeCoupon && subtotal >= activeCoupon.minAmount ? subtotal * (activeCoupon.percent / 100) : 0;
    const discounted = Math.max(0, subtotal - discount);
    const shipping = discounted === 0 ? 0 : discounted >= 50 ? 0 : 4.9;
    return { subtotal, discount, shipping, total: discounted + shipping };
  }, [cart, activeCoupon]);

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

  function stockInCart(productId) {
    return cart.filter((item) => item.type === "catalog" && item.productId === productId && !item.preorder).reduce((sum, item) => sum + item.quantity, 0);
  }

  function availableNow(product) {
    return Math.max(0, Number(product.stock || 0) - stockInCart(product.id));
  }

  function addCatalogProduct(product) {
    const available = availableNow(product);
    const preorder = available <= 0;
    if (preorder && !product.etaDays) return;

    const finalUnitPrice = Number((effectivePrice(product) * (1 - seasonExtra / 100)).toFixed(2));
    const lineId = preorder ? `catalog-${product.id}-pre-${season}` : `catalog-${product.id}-stock-${season}`;
    setCart((prev) => {
      const existing = prev.find((item) => item.id === lineId);
      if (existing) {
        return prev.map((item) => (item.id === lineId ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [
        ...prev,
        {
          id: lineId,
          type: "catalog",
          productId: product.id,
          name: preorder ? `${product.name} (prednarocilo)` : product.name,
          scent: product.scent,
          quantity: 1,
          unitPrice: finalUnitPrice,
          preorder,
          etaDays: preorder ? product.etaDays : 1
        }
      ];
    });
  }

  function addPersonalized(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const base = String(form.get("base"));
    const text = String(form.get("text"));
    const scent = String(form.get("scent"));
    const qty = Number(form.get("qty") || 1);
    const logoFile = form.get("logo");
    const logoName = logoFile && typeof logoFile === "object" ? logoFile.name : "";

    setCart((prev) => [
      ...prev,
      {
        id: `custom-${Date.now()}`,
        type: "custom",
        productId: null,
        name: `Personalized ${base}`,
        scent,
        quantity: qty,
        unitPrice: Number((49 * (1 - seasonExtra / 100)).toFixed(2)) + (logoName ? 6 : 0),
        preorder: true,
        etaDays: 7,
        note: `Napis: ${text}${logoName ? `, Logo: ${logoName}` : ""}`
      }
    ]);

    setCustomMessage(t.personalizedAdded);
    if (customPreview.logoUrl) {
      URL.revokeObjectURL(customPreview.logoUrl);
    }
    setCustomPreview({ text: "", scent: "Amber Vanilla", base: "Signature Jar", logoUrl: "" });
    event.currentTarget.reset();
  }

  function changeQty(itemId, delta) {
    setCart((prev) => {
      const next = prev
        .map((item) => (item.id === itemId ? { ...item, quantity: item.quantity + delta } : item))
        .filter((item) => item.quantity > 0);
      return next;
    });
  }

  function removeItem(itemId) {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  }

  function applyCoupon() {
    const code = couponCode.trim().toUpperCase();
    const found = coupons.find((item) => item.code === code);
    if (!found) {
      setCouponMessage(t.couponMissing);
      return;
    }
    if (totals.subtotal < found.minAmount) {
      setCouponMessage(t.couponMin(formatPrice(found.minAmount)));
      return;
    }
    setActiveCoupon(found);
    setCouponMessage(t.couponApplied(found.code, found.percent));
  }

  async function checkout() {
    if (!cart.length) return;
    if (!user) {
      setCheckoutMessage(t.checkoutLogin);
      return;
    }

    setCheckoutMessage(t.checkoutLoading);
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: cart,
        couponCode: activeCoupon?.code || null,
        customerEmail: user.email
      })
    });
    const data = await response.json();

    if (!response.ok) {
      setCheckoutMessage(data.message || t.checkoutFailed);
      return;
    }

    if (data.checkoutUrl) {
      window.location.href = data.checkoutUrl;
      return;
    }

    setCheckoutMessage(
      `Narocilo ${data.orderNumber} pripravljeno. Tracking: ${data.trackingNumber}. Racun: ${data.invoiceNumber}.`
    );
    setCart([]);
    setActiveCoupon(null);
    setCouponCode("");
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  }

  function ProductSection({ title, intro, items }) {
    return (
      <section className="mx-auto w-[min(1180px,92%)] py-12">
        <h2 className="display-font text-4xl text-[#fff5e8] md:text-5xl">{title}</h2>
        <p className="mb-7 mt-2 max-w-2xl text-[#dac7ae]">{intro}</p>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((product) => {
            const currentPrice = Number((effectivePrice(product) * (1 - seasonExtra / 100)).toFixed(2));
            const available = availableNow(product);
            const canPreorder = product.etaDays > 0;
            const disabled = available <= 0 && !canPreorder;
            return (
              <article key={product.id} className="panel flex min-h-[420px] flex-col p-4">
                <img src={productImage(product)} alt={product.name} className="mb-3 aspect-square w-full rounded-xl border border-[var(--line)] object-cover" />
                <div className="mb-2 flex flex-wrap gap-1">
                  <span className="rounded-full border border-[var(--line)] px-2 py-1 text-[10px] uppercase tracking-[0.08em]">
                    {categoryLabel(product.category, lang)}
                  </span>
                  {product.isTop ? <span className="rounded-full border border-[var(--gold)] px-2 py-1 text-[10px] uppercase tracking-[0.08em] text-[var(--gold)]">Top hit</span> : null}
                  {product.isNew ? <span className="rounded-full border border-[var(--gold)] px-2 py-1 text-[10px] uppercase tracking-[0.08em] text-[var(--gold)]">Novost</span> : null}
                  {product.salePercent ? (
                    <span className="rounded-full border border-[var(--gold)] px-2 py-1 text-[10px] uppercase tracking-[0.08em] text-[var(--gold)]">-{product.salePercent}%</span>
                  ) : null}
                  {seasonExtra > 0 ? (
                    <span className="rounded-full border border-[#f3bb7c] px-2 py-1 text-[10px] uppercase tracking-[0.08em] text-[#f3bb7c]">-{seasonExtra}%</span>
                  ) : null}
                </div>
                <h3 className="display-font text-4xl text-[#fff8ec]">{product.name}</h3>
                <p className="mb-2 text-sm text-[#dec8ad]">{product.scent}</p>
                <p className="mb-3 flex-grow text-sm leading-7 text-[#d7c6af]">{product.description}</p>
                <p className={`mb-3 text-xs ${available > 0 ? "text-[#e5d4be]" : "text-[#f3bb7c]"}`}>
                  {available > 0 ? t.stock(available) : t.outOfStock(product.etaDays)}
                </p>
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-lg font-bold text-[var(--gold)]">{formatPrice(currentPrice)}</span>
                  {product.salePercent || seasonExtra > 0 ? <span className="text-sm text-[#96836a] line-through">{formatPrice(product.price)}</span> : null}
                </div>
                <button className="pill-btn" disabled={disabled} onClick={() => addCatalogProduct(product)}>
                  {available > 0 ? t.addToCart : canPreorder ? t.preOrder(product.etaDays) : t.unavailable}
                </button>
              </article>
            );
          })}
        </div>
      </section>
    );
  }

  return (
    <div className="pb-16">
      <div className="border-b border-[var(--line)] bg-[#26190f] px-4 py-4 text-center">
        <div className="mx-auto w-[min(1180px,92%)]">
          <p className="display-font text-4xl uppercase tracking-[0.09em] text-[#ffd7a2] md:text-6xl">{t.testTitle}</p>
          <p className="mt-2 text-xs uppercase tracking-[0.11em] text-[#ffd7a2] md:text-sm">{t.legal}</p>
        </div>
      </div>

      <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-[rgba(15,13,11,0.9)] backdrop-blur-md">
        <div className="mx-auto flex w-[min(1180px,92%)] flex-wrap items-center justify-between gap-4 py-4">
          <a href={shopOnly ? "/shop" : "#home"} className="flex items-center gap-3">
            <img src="/assets/saromen-logo.png" alt="SAROMEN logo" className="h-12 w-auto rounded-lg border border-[var(--line)] bg-black/30 p-1" />
            <span className="display-font text-4xl tracking-[0.2em] text-[var(--gold)]">SAROMEN</span>
          </a>
          <nav className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.11em] text-[#f3e7d5]">
            <a href="/shop">{t.navShop}</a>
            <a href={shopOnly ? "/#top-hiti" : "#top-hiti"}>{t.navTopHits}</a>
            <a href={shopOnly ? "/#popusti" : "#popusti"}>{t.navDiscounts}</a>
            <a href={shopOnly ? "/#novosti" : "#novosti"}>{t.navNews}</a>
            <a href={shopOnly ? "/#shop" : "#shop"}>{t.navDeals}</a>
            <a href={shopOnly ? "/#personalized" : "#personalized"}>{t.navPersonalized}</a>
            <a href={shopOnly ? "/#blog" : "#blog"}>{t.navBlog}</a>
            <a href={shopOnly ? "/#kontakt" : "#kontakt"}>{t.navContact}</a>
          </nav>
          <div className="flex flex-wrap items-center gap-2">
            <LanguageSwitcher lang={lang} setLang={setLang} />
            {user ? (
              <>
                <a href="/profile" className="pill-btn">
                  {t.profile}
                </a>
                <button className="pill-btn" onClick={logout}>
                  {t.logout}
                </button>
              </>
            ) : (
              <a href="/login" className="pill-btn">
                {t.login}
              </a>
            )}
            <button className="pill-btn" onClick={() => setCartOpen(true)}>
              {t.cart} ({cartCount})
            </button>
          </div>
        </div>
      </header>

      <div className="border-b border-[var(--line)] bg-[#1d130c] px-4 py-3">
        <div className="mx-auto flex w-[min(1180px,92%)] flex-wrap items-center justify-between gap-2 text-xs uppercase tracking-[0.1em] text-[#f2d2a4]">
          <span>{t.navDeals}</span>
          <div className="flex flex-wrap gap-2">
            <button className={`pill-btn ${season === "classic" ? "border-[var(--gold)] text-[var(--gold)]" : ""}`} onClick={() => setSeason("classic")}>
              {t.classic}
            </button>
            <button className={`pill-btn ${season === "blackfriday" ? "border-[var(--gold)] text-[var(--gold)]" : ""}`} onClick={() => setSeason("blackfriday")}>
              {t.blackFriday}
            </button>
            <button className={`pill-btn ${season === "halloween" ? "border-[var(--gold)] text-[var(--gold)]" : ""}`} onClick={() => setSeason("halloween")}>
              {t.halloween}
            </button>
          </div>
        </div>
      </div>

      {!shopOnly ? (
        <>
          <section
            id="home"
            className="mx-auto grid w-[min(1180px,92%)] gap-6 rounded-2xl border border-[var(--line)] py-14 md:grid-cols-[1.35fr_0.65fr] md:items-center"
            style={{
              backgroundImage: "linear-gradient(140deg, rgba(0,0,0,0.6), rgba(0,0,0,0.35)), url('/assets/candle-bg.svg')",
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
          >
            <div className="px-6">
              <span className="inline-block rounded-full border border-[var(--line)] px-4 py-2 text-[11px] uppercase tracking-[0.15em] text-[var(--beige)]">
                Luxury Candle Brand
              </span>
              <h1 className="display-font mt-4 text-5xl leading-[0.96] text-[#fff8ec] md:text-7xl">Svece kot atmosfera, dizajn in osebna zgodba.</h1>
              <p className="mt-5 max-w-2xl text-lg text-[#e4d5bf]">
                Premium candle ecommerce za SAROMEN: top hiti, popusti, novosti, personalizirane svece, kuponi, izracun postnine in Stripe checkout.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="/shop" className="pill-btn border-[var(--gold)] bg-[var(--gold)] text-[#25190f]">
                  {t.navShop}
                </a>
                <a href="#about" className="pill-btn">
                  Zgodba Sara + Domen
                </a>
              </div>
            </div>
            <div className="grid gap-3 px-6">
              <div className="panel p-5">
                <div className="display-font text-4xl text-[var(--gold)]">24h</div>
                <p className="text-sm text-[#dcc8ad]">Povprecen odziv podpore</p>
              </div>
              <div className="panel p-5">
                <div className="display-font text-4xl text-[var(--gold)]">50+ EUR</div>
                <p className="text-sm text-[#dcc8ad]">Brezplacna postnina</p>
              </div>
              <div className="panel p-5">
                <div className="display-font text-4xl text-[var(--gold)]">3-7 dni</div>
                <p className="text-sm text-[#dcc8ad]">Personalizirane izdelave</p>
              </div>
            </div>
          </section>

          <div id="top-hiti">
            <ProductSection title={t.navTopHits} intro="Najbolj prodajani premium modeli." items={topHits} />
          </div>
          <div id="popusti">
            <ProductSection title={t.navDiscounts} intro="Aktualne akcije in kuponske kombinacije." items={discounts} />
          </div>
          <div id="novosti">
            <ProductSection title={t.navNews} intro="Sveze kolekcije in novi vonji." items={novosti} />
          </div>
        </>
      ) : null}

      <section id="shop" className="mx-auto w-[min(1180px,92%)] py-12">
        <h2 className="display-font text-4xl text-[#fff5e8] md:text-5xl">{t.navShop}</h2>
        <p className="mb-6 mt-2 max-w-2xl text-[#dac7ae]">Razlicna podrocja: disavne, dekorativne, modni dodatek, dodatki in merch.</p>
        <div className="mb-5 flex flex-wrap gap-2">
          {categories.map((item) => (
            <button key={item} className={`pill-btn ${item === category ? "border-[var(--gold)] text-[var(--gold)]" : ""}`} onClick={() => setCategory(item)}>
              {item === "all" ? t.all : categoryLabel(item, lang)}
            </button>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {catalog.map((product) => (
            <article key={product.id} className="panel flex min-h-[410px] flex-col p-4">
              <img src={productImage(product)} alt={product.name} className="mb-3 aspect-square w-full rounded-xl border border-[var(--line)] object-cover" />
              <p className="mb-2 text-[10px] uppercase tracking-[0.1em] text-[#f0c189]">{categoryLabel(product.category, lang)}</p>
              <h3 className="display-font text-4xl text-[#fff8ec]">{product.name}</h3>
              <p className="text-sm text-[#dec8ad]">{product.scent}</p>
              <p className="mb-4 mt-2 flex-grow text-sm leading-7 text-[#d7c6af]">{product.description}</p>
              <p className={`mb-3 text-xs ${Number(product.stock || 0) > 0 ? "text-[#e5d4be]" : "text-[#f3bb7c]"}`}>
                {Number(product.stock || 0) > 0 ? t.stock(product.stock) : t.outOfStock(product.etaDays)}
              </p>
              <div className="mb-3 flex items-center gap-2">
                <span className="text-lg font-bold text-[var(--gold)]">{formatPrice(Number((effectivePrice(product) * (1 - seasonExtra / 100)).toFixed(2)))}</span>
                {product.salePercent || seasonExtra > 0 ? <span className="text-sm text-[#96836a] line-through">{formatPrice(product.price)}</span> : null}
              </div>
              <button className="pill-btn" onClick={() => addCatalogProduct(product)}>
                {t.addToCart}
              </button>
            </article>
          ))}
        </div>
      </section>

      <section id="personalized" className="mx-auto w-[min(1180px,92%)] py-12">
        <h2 className="display-font text-4xl text-[#fff5e8] md:text-5xl">{t.navPersonalized}</h2>
        <p className="mb-6 mt-2 max-w-2xl text-[#dac7ae]">Napis, logo in vonj po meri. Rok izdelave: 3-7 dni.</p>
        <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
          <form className="panel grid gap-2 p-5" onSubmit={addPersonalized}>
            <label className="text-xs uppercase tracking-[0.1em] text-[#e7d2b5]">Tip svece</label>
            <select
              name="base"
              required
              onChange={(event) => setCustomPreview((prev) => ({ ...prev, base: event.target.value }))}
              className="rounded-xl border border-[var(--line)] bg-[rgba(0,0,0,0.3)] p-3 text-sm"
            >
              <option value="Signature Jar">Signature Jar</option>
              <option value="Wedding Edition">Wedding Edition</option>
              <option value="Corporate Gift">Corporate Gift</option>
              <option value="Poljubna Candle">Poljubna Candle</option>
            </select>
            <label className="text-xs uppercase tracking-[0.1em] text-[#e7d2b5]">Napis</label>
            <input
              name="text"
              required
              onChange={(event) => setCustomPreview((prev) => ({ ...prev, text: event.target.value }))}
              className="rounded-xl border border-[var(--line)] bg-[rgba(0,0,0,0.3)] p-3 text-sm"
              placeholder="Npr. Sara & Domen 2026"
            />
            <label className="text-xs uppercase tracking-[0.1em] text-[#e7d2b5]">Vonj</label>
            <input
              name="scent"
              required
              onChange={(event) => setCustomPreview((prev) => ({ ...prev, scent: event.target.value }))}
              className="rounded-xl border border-[var(--line)] bg-[rgba(0,0,0,0.3)] p-3 text-sm"
              placeholder="Npr. Amber Vanilla"
            />
            <label className="text-xs uppercase tracking-[0.1em] text-[#e7d2b5]">Logo (opcija)</label>
            <input
              name="logo"
              type="file"
              accept=".png,.jpg,.jpeg,.svg"
              onChange={(event) => {
                const file = event.currentTarget.files?.[0];
                setCustomPreview((prev) => {
                  if (prev.logoUrl) URL.revokeObjectURL(prev.logoUrl);
                  return { ...prev, logoUrl: file ? URL.createObjectURL(file) : "" };
                });
              }}
              className="rounded-xl border border-[var(--line)] bg-[rgba(0,0,0,0.3)] p-3 text-sm"
            />
            <label className="text-xs uppercase tracking-[0.1em] text-[#e7d2b5]">Kolicina</label>
            <input name="qty" type="number" min="1" defaultValue="1" className="rounded-xl border border-[var(--line)] bg-[rgba(0,0,0,0.3)] p-3 text-sm" />
            <button className="pill-btn border-[var(--gold)] bg-[var(--gold)] text-[#25190f]" type="submit">
              Dodaj personalizirano
            </button>
            <p className="text-sm text-[#f0c189]">{customMessage}</p>
          </form>
          <div className="grid gap-4">
            <div className="panel p-5">
              <h3 className="display-font text-4xl text-[var(--gold)]">Predogled personalizacije</h3>
              <div className="mt-4 rounded-2xl border border-[var(--line)] bg-[linear-gradient(170deg,#22170f,#130f0b)] p-5">
                <div className="relative mx-auto h-[280px] w-[180px]">
                  <div className="absolute left-1/2 top-0 h-14 w-8 -translate-x-1/2 rounded-full bg-[#f5ce96] blur-sm" />
                  <div className="absolute bottom-0 left-1/2 h-[240px] w-[150px] -translate-x-1/2 rounded-[65px_65px_20px_20px] border border-[#d2a86d] bg-[linear-gradient(180deg,#b58752,#6a4828)]" />
                  <div className="absolute bottom-16 left-1/2 w-[120px] -translate-x-1/2 rounded-xl border border-[#e7c58e66] bg-[rgba(17,12,9,0.55)] p-2 text-center text-[10px]">
                    <p className="font-semibold uppercase tracking-[0.08em] text-[#f6e2c2]">{customPreview.text || "Tvoj napis"}</p>
                    <p className="mt-1 text-[#ebc694]">{customPreview.scent || "Amber Vanilla"}</p>
                  </div>
                  <div className="absolute bottom-6 right-2">
                    {customPreview.logoUrl ? (
                      <img src={customPreview.logoUrl} alt="Logo preview" className="h-9 w-9 rounded-full border border-[#e4bd86] object-cover" />
                    ) : (
                      <span className="grid h-9 w-9 place-items-center rounded-full border border-[#e4bd86] text-[9px] text-[#e4bd86]">Logo</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="panel p-5">
              <h3 className="display-font text-4xl text-[var(--gold)]">Svece in Lifestyle</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-[#dbc8ad]">
                <li>Topli toni (amber, vanilla, musk) ustvarijo vecerni luxury ambient.</li>
                <li>Svece so modni dodatek na polici, mizi ali v reception prostoru.</li>
                <li>Prvi burn 2-3 ure in skrajsan stenj bistveno podaljsata zivljenjsko dobo.</li>
                <li>Personalizirani modeli so primerni za darila in corporate pakete.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {!shopOnly ? (
        <>
          <section id="about" className="mx-auto w-[min(1180px,92%)] py-12">
            <h2 className="display-font text-4xl text-[#fff5e8] md:text-5xl">O Nas: Sara in Domen</h2>
            <div className="panel mt-4 grid gap-3 p-5 text-sm leading-8 text-[#dbc8ad]">
              <p>Sara je oblikovalka z obcutkom za estetiko prostora, Domen pa podjetnik, ki obozuje gradnjo znamke in sistemsko rast.</p>
              <p>Iz njune ljubezni in skupne poslovne vizije je nastal SAROMEN: premium candle studio, kjer vsak produkt povezuje emocijo, dizajn in kakovost.</p>
              <p>Danes gradita sodobno spletno trgovino z osredotocenostjo na uporabnisko izkusnjo, personalizacijo in elegantno predstavitev izdelkov.</p>
            </div>
          </section>

          <section id="blog" className="mx-auto w-[min(1180px,92%)] py-12">
            <h2 className="display-font text-4xl text-[#fff5e8] md:text-5xl">{t.navBlog}</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <article className="panel p-5">
                <h3 className="display-font text-4xl">Luxury ambient doma</h3>
                <p className="mt-2 text-sm leading-7 text-[#dbc8ad]">Prakticen vodi za elegantno osvetlitev, vonje in postavitev dekorja.</p>
              </article>
              <article className="panel p-5">
                <h3 className="display-font text-4xl">Vodnik po vonjih</h3>
                <p className="mt-2 text-sm leading-7 text-[#dbc8ad]">Primerjava amber, fig, white tea in cedar profilov za razlicne trenutke.</p>
              </article>
              <article className="panel p-5">
                <h3 className="display-font text-4xl">Personalizirana darila</h3>
                <p className="mt-2 text-sm leading-7 text-[#dbc8ad]">Kako izbrati napis, vonj in embalazo za dogodke ali business gifting.</p>
              </article>
            </div>
          </section>

          <section id="kontakt" className="mx-auto w-[min(1180px,92%)] py-12">
            <h2 className="display-font text-4xl text-[#fff5e8] md:text-5xl">{t.navContact}</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <div className="panel p-5 text-sm leading-7 text-[#dbc8ad]">
                <p>
                  <strong>Email:</strong> hello@saromen.com
                </p>
                <p>
                  <strong>Podpora:</strong> support@saromen.com
                </p>
              </div>
              <div className="panel p-5 text-sm leading-7 text-[#dbc8ad]">
                <p>
                  <strong>Instagram:</strong> @saromen.candles
                </p>
                <p>
                  <strong>Facebook:</strong> /saromen.candles
                </p>
              </div>
              <div className="panel p-5 text-sm leading-7 text-[#dbc8ad]">
                <p>
                  <strong>Lokacija:</strong> Slovenia
                </p>
                <p>
                  <strong>Dostava:</strong> SI + EU
                </p>
              </div>
            </div>
          </section>
        </>
      ) : null}

      <footer className="mx-auto w-[min(1180px,92%)] border-t border-[var(--line)] py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-[#dbc8ad]">SAROMEN Candle Studio</p>
          <div className="flex items-center gap-2">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="pill-btn">IG</a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="pill-btn">FB</a>
            <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="pill-btn">TT</a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="pill-btn">YT</a>
          </div>
        </div>
      </footer>

      <aside
        className={`fixed right-0 top-0 z-40 flex h-full w-full max-w-[430px] flex-col border-l border-[var(--line)] bg-[#12100c] transition-transform ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-[var(--line)] px-4 py-4">
          <h3 className="display-font text-4xl text-[var(--gold)]">{t.cart}</h3>
          <button className="pill-btn" onClick={() => setCartOpen(false)}>
            {t.close}
          </button>
        </div>
        <div className="grid gap-2 overflow-auto p-4">
          {cart.length === 0 ? <div className="rounded-xl border border-dashed border-[var(--line)] p-4 text-sm text-[#cfbc9f]">{t.cartEmpty}</div> : null}
          {cart.map((item) => (
            <div key={item.id} className="rounded-xl border border-[var(--line)] p-3 text-sm">
              <div className="mb-1 flex justify-between gap-2">
                <span>{item.name}</span>
                <strong>{formatPrice(item.unitPrice * item.quantity)}</strong>
              </div>
              <div className="mb-2 text-xs text-[#d7c3a4]">
                {item.scent} / {item.preorder ? "Pre-order" : "Stock"} / ETA {item.etaDays} dni
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex gap-1">
                  <button className="pill-btn" onClick={() => changeQty(item.id, -1)}>
                    -
                  </button>
                  <button className="pill-btn" onClick={() => changeQty(item.id, 1)}>
                    +
                  </button>
                </div>
                <button className="pill-btn" onClick={() => removeItem(item.id)}>
                  {t.remove}
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-[var(--line)] p-4">
          <label className="mb-2 block text-xs uppercase tracking-[0.1em] text-[#e7d2b5]">{t.coupon}</label>
          <div className="mb-2 flex gap-2">
            <input
              className="w-full rounded-xl border border-[var(--line)] bg-[rgba(0,0,0,0.35)] p-3 text-sm"
              value={couponCode}
              onChange={(event) => setCouponCode(event.target.value)}
              placeholder="SARA10"
            />
            <button className="pill-btn" onClick={applyCoupon}>
              {t.apply}
            </button>
          </div>
          <p className="mb-2 text-xs text-[#eec28d]">{couponMessage}</p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>{t.subtotal}</span>
              <strong>{formatPrice(totals.subtotal)}</strong>
            </div>
            <div className="flex justify-between">
              <span>{t.discount}</span>
              <strong>- {formatPrice(totals.discount)}</strong>
            </div>
            <div className="flex justify-between">
              <span>{t.shipping}</span>
              <strong>{formatPrice(totals.shipping)}</strong>
            </div>
            <div className="flex justify-between text-base">
              <span>{t.total}</span>
              <strong>{formatPrice(totals.total)}</strong>
            </div>
            <p className="text-xs text-[#d9c3a4]">Brezplacna postnina nad EUR 50.00.</p>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              className="pill-btn"
              onClick={() => {
                setCart([]);
                setActiveCoupon(null);
                setCouponCode("");
                setCheckoutMessage("");
              }}
            >
              {t.clear}
            </button>
            <button className="pill-btn border-[var(--gold)] bg-[var(--gold)] text-[#25190f]" onClick={checkout}>
              Checkout
            </button>
          </div>
          <p className="mt-2 text-xs text-[#f0c189]">{checkoutMessage}</p>
        </div>
      </aside>
    </div>
  );
}
