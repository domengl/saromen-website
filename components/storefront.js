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

export default function Storefront({ shopOnly = false, preset = "all" }) {
  const [lang, setLang] = useLanguage("sl");
  const t = TRANSLATIONS[lang] || TRANSLATIONS.sl;
  const [products, setProducts] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [offers, setOffers] = useState([]);
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [activeCoupon, setActiveCoupon] = useState(null);
  const [activeVoucher, setActiveVoucher] = useState(null);
  const [couponMessage, setCouponMessage] = useState("");
  const [checkoutMessage, setCheckoutMessage] = useState("");
  const [user, setUser] = useState(null);
  const [customMessage, setCustomMessage] = useState("");
  const [giftMessage, setGiftMessage] = useState("");
  const [customPreview, setCustomPreview] = useState({
    text: "",
    scent: "Amber Vanilla",
    base: "Signature Jar",
    logoUrl: ""
  });
  const [openedProduct, setOpenedProduct] = useState(null);

  useEffect(() => {
    return () => {
      if (customPreview.logoUrl) {
        URL.revokeObjectURL(customPreview.logoUrl);
      }
    };
  }, [customPreview.logoUrl]);

  useEffect(() => {
    const load = async () => {
      const [productsRes, couponsRes, offersRes, meRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/coupons"),
        fetch("/api/special-offers"),
        fetch("/api/auth/me")
      ]);
      const productsJson = await productsRes.json();
      const couponsJson = await couponsRes.json();
      const offersJson = await offersRes.json();
      const meJson = await meRes.json();
      setProducts(productsJson.items || []);
      setCoupons(couponsJson.items || []);
      setOffers(offersJson.items || []);
      setUser(meJson.user || null);
    };
    load();
  }, []);

  const presetProducts = useMemo(() => {
    if (preset === "top") return products.filter((item) => item.isTop);
    if (preset === "discount") return products.filter((item) => item.salePercent > 0);
    if (preset === "new") return products.filter((item) => item.isNew);
    return products;
  }, [products, preset]);

  const categories = useMemo(() => ["all", ...new Set(presetProducts.map((item) => item.category))], [presetProducts]);
  const topHits = useMemo(() => products.filter((item) => item.isTop), [products]);
  const discounts = useMemo(() => products.filter((item) => item.salePercent > 0), [products]);
  const novosti = useMemo(() => products.filter((item) => item.isNew), [products]);
  const catalog = useMemo(
    () =>
      (category === "all" ? presetProducts : presetProducts.filter((item) => item.category === category)).filter((item) => {
        if (!search.trim()) return true;
        const query = search.toLowerCase();
        return [item.name, item.scent, item.description, item.category].join(" ").toLowerCase().includes(query);
      }),
    [category, presetProducts, search]
  );
  const seasonExtra = useMemo(() => {
    if (!offers.length) return 0;
    return offers.reduce((max, item) => Math.max(max, Number(item.percent || 0)), 0);
  }, [offers]);
  const shopHeading = preset === "top" ? t.navTopHits : preset === "discount" ? t.navDiscounts : preset === "new" ? t.navNews : t.navShop;

  const totals = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const couponDiscount = activeCoupon && subtotal >= activeCoupon.minAmount ? subtotal * (activeCoupon.percent / 100) : 0;
    const voucherDiscount = activeVoucher ? Math.min(Math.max(0, subtotal - couponDiscount), Number(activeVoucher.amount || 0)) : 0;
    const discount = couponDiscount + voucherDiscount;
    const discounted = Math.max(0, subtotal - discount);
    const shipping = discounted === 0 ? 0 : discounted >= 50 ? 0 : 4.9;
    return { subtotal, discount, shipping, total: discounted + shipping, couponDiscount, voucherDiscount };
  }, [cart, activeCoupon, activeVoucher]);

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const profileName = useMemo(() => {
    if (!user) return "";
    if (user.name && String(user.name).trim()) return String(user.name).trim();
    if (user.email && String(user.email).trim()) return String(user.email).trim();
    return "User";
  }, [user]);

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
    const lineId = preorder ? `catalog-${product.id}-pre-${seasonExtra}` : `catalog-${product.id}-stock-${seasonExtra}`;
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
          productSlug: product.slug || null,
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

  async function applyCoupon() {
    const code = couponCode.trim().toUpperCase();
    if (!code) return;
    const found = coupons.find((item) => item.code === code);
    if (found) {
      if (totals.subtotal < found.minAmount) {
        setCouponMessage(t.couponMin(formatPrice(found.minAmount)));
        return;
      }
      setActiveCoupon(found);
      setActiveVoucher(null);
      setCouponMessage(t.couponApplied(found.code, found.percent));
      return;
    }

    const response = await fetch("/api/vouchers/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code })
    });
    const data = await response.json();
    if (!response.ok || !data.valid) {
      setCouponMessage(t.couponMissing);
      return;
    }

    setActiveCoupon(null);
    setActiveVoucher({ code, amount: data.amount });
    setCouponMessage(`Darilni bon aktiviran (${formatPrice(data.amount)}).`);
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
        voucherCode: activeVoucher?.code || null,
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
    setActiveVoucher(null);
    setCouponCode("");
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  }

  async function purchaseVoucher(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      amount: Number(form.get("amount") || 0),
      recipientEmail: String(form.get("recipientEmail") || ""),
      recipientName: String(form.get("recipientName") || ""),
      purchaserEmail: String(form.get("purchaserEmail") || "")
    };

    setGiftMessage("Pripravljam darilni bon...");
    const response = await fetch("/api/vouchers/purchase", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) {
      setGiftMessage(data.message || "Nakup darilnega bona ni uspel.");
      return;
    }

    if (data.emailSent) {
      setGiftMessage(`Darilni bon ustvarjen. Koda je poslana na ${payload.recipientEmail}.`);
    } else {
      setGiftMessage(`Darilni bon ustvarjen. Email servis ni aktiven, uporabi kodo: ${data.code}`);
    }
    event.currentTarget.reset();
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
                <div className="mt-auto grid grid-cols-2 gap-2">
                  <button className="pill-btn" onClick={() => setOpenedProduct(product)}>
                    Odpri izdelek
                  </button>
                  <button className="pill-btn" disabled={disabled} onClick={() => addCatalogProduct(product)}>
                    {available > 0 ? t.addToCart : canPreorder ? t.preOrder(product.etaDays) : t.unavailable}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    );
  }

  function PaymentLogos({ compact = false }) {
    const cardSize = compact ? "h-8 min-w-[90px] px-2 text-[10px]" : "h-10 min-w-[120px] px-3 text-xs";
    return (
      <div className={`flex flex-wrap gap-2 ${compact ? "" : "mt-3"}`}>
        <span className={`inline-flex items-center justify-center rounded-full border border-[var(--line)] bg-[#111622] font-bold tracking-[0.1em] text-[#9fc2ff] ${cardSize}`}>
          Visa
        </span>
        <span className={`inline-flex items-center gap-1 rounded-full border border-[var(--line)] bg-[#1a130e] font-semibold tracking-[0.05em] ${cardSize}`}>
          <svg viewBox="0 0 28 16" className="h-3 w-6" aria-hidden="true">
            <circle cx="11" cy="8" r="6" fill="#eb5548" />
            <circle cx="17" cy="8" r="6" fill="#f3b54a" />
          </svg>
          Mastercard
        </span>
        <span className={`inline-flex items-center gap-1 rounded-full border border-[var(--line)] bg-[#17130f] font-semibold tracking-[0.05em] ${cardSize}`}>
          <svg viewBox="0 0 24 24" className="h-3 w-3 fill-[#5ea7ff]" aria-hidden="true">
            <path d="M7 7h5a5 5 0 0 1 0 10H9v4H5V9a2 2 0 0 1 2-2Z" />
            <path d="M13 7h4a2 2 0 0 1 2 2v8h-6a5 5 0 0 0 0-10Z" />
          </svg>
          PayPal
        </span>
        <span className={`inline-flex items-center justify-center rounded-full border border-[var(--line)] bg-[#17130f] font-semibold tracking-[0.05em] ${cardSize}`}>
          Apple Pay
        </span>
        <span className={`inline-flex items-center justify-center rounded-full border border-[var(--line)] bg-[#17130f] font-semibold tracking-[0.05em] ${cardSize}`}>
          G Pay
        </span>
      </div>
    );
  }

  return (
    <div className="pb-16">
      <div className="border-b border-[var(--line)] bg-[#26190f] px-4 py-4 text-center">
        <div className="mx-auto w-[min(1180px,92%)]">
          <div className="flex justify-end">
            <LanguageSwitcher lang={lang} setLang={setLang} />
          </div>
          <p className="display-font text-4xl uppercase tracking-[0.09em] text-[#ffd7a2] md:text-6xl">{t.testTitle}</p>
          <p className="mt-2 text-xs uppercase tracking-[0.11em] text-[#ffd7a2] md:text-sm">{t.legal}</p>
        </div>
      </div>

      <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-[rgba(15,13,11,0.9)] backdrop-blur-md">
        <div className="mx-auto flex w-[min(1180px,92%)] flex-wrap items-center justify-between gap-4 py-4">
          <a href="/" className="flex items-center gap-3">
            <img src="/assets/saromen-logo.png" alt="SAROMEN logo" className="h-11 w-auto rounded-lg border border-[var(--line)] bg-black/30 p-1" />
          </a>
          <nav className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.11em] text-[#f3e7d5]">
            <a href="/shop">{t.navShop}</a>
            <a href="/top-hits">{t.navTopHits}</a>
            <a href="/popusti">{t.navDiscounts}</a>
            <a href="/novosti">{t.navNews}</a>
            <a href="/shop#personalized">{t.navPersonalized}</a>
            <a href="/blog">{t.navBlog}</a>
            <a href="/kontakt">{t.navContact}</a>
            <a href="/faq">FAQ</a>
            <a href="/help">Help</a>
          </nav>
          <div className="flex flex-wrap items-center gap-2">
            <input
              className="rounded-full border border-[var(--line)] bg-[rgba(255,255,255,0.04)] px-4 py-2 text-xs"
              placeholder="Search..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            {user ? (
              <>
                <a
                  href="/profile"
                  className="inline-flex max-w-[210px] items-center gap-2 rounded-full border border-[var(--line)] bg-[rgba(255,255,255,0.04)] px-2 py-1"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-full border border-[var(--line)] bg-[#1f1711]">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current text-[#f2d7b3]" aria-hidden="true">
                      <circle cx="12" cy="8.2" r="3.2" strokeWidth="1.8" />
                      <path d="M4.6 19c1.2-3 4-4.8 7.4-4.8s6.2 1.8 7.4 4.8" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  </span>
                  <span className="truncate text-xs text-[#f2e0c5]">{profileName}</span>
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
            <button className="pill-btn border-[var(--gold)] text-[var(--gold)]" onClick={() => setCartOpen(true)}>
              {t.cart} ({cartCount})
            </button>
          </div>
        </div>
      </header>

      <div className="border-b border-[var(--line)] bg-[#1d130c] px-4 py-3">
        <div className="mx-auto flex w-[min(1180px,92%)] flex-wrap items-center justify-between gap-2 text-xs uppercase tracking-[0.1em] text-[#f2d2a4]">
          <span>{t.navDeals}</span>
          <div className="flex flex-wrap gap-2">
            {offers.length === 0 ? <span className="pill-btn">Brez aktivnih ugodnosti</span> : null}
            {offers.map((offer) => (
              <span key={offer.id} className="pill-btn border-[var(--gold)] text-[var(--gold)]">
                {offer.title} -{offer.percent}%
              </span>
            ))}
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
        <h2 className="display-font text-4xl text-[#fff5e8] md:text-5xl">{shopHeading}</h2>
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
              <div className="mt-auto grid grid-cols-2 gap-2">
                <button className="pill-btn" onClick={() => setOpenedProduct(product)}>
                  Odpri izdelek
                </button>
                <button className="pill-btn" onClick={() => addCatalogProduct(product)}>
                  {t.addToCart}
                </button>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-4 text-xs uppercase tracking-[0.1em] text-[#d8c0a1]">Klikni &quot;Odpri izdelek&quot; za podrobnosti.</p>
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

      <section id="gift-vouchers" className="mx-auto w-[min(1180px,92%)] py-12">
        <h2 className="display-font text-4xl text-[#fff5e8] md:text-5xl">Darilni boni</h2>
        <p className="mb-6 mt-2 max-w-2xl text-[#dac7ae]">Ob nakupu darilnega bona prejemnik prejme email z unikatno varnostno kodo za aktivacijo v trgovini.</p>
        <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
          <form className="panel grid gap-2 p-5" onSubmit={purchaseVoucher}>
            <label className="text-xs uppercase tracking-[0.1em] text-[#e7d2b5]">Znesek (EUR)</label>
            <input name="amount" type="number" min="10" step="1" defaultValue="50" className="rounded-xl border border-[var(--line)] bg-[rgba(0,0,0,0.3)] p-3 text-sm" />
            <label className="text-xs uppercase tracking-[0.1em] text-[#e7d2b5]">Email prejemnika</label>
            <input name="recipientEmail" type="email" required className="rounded-xl border border-[var(--line)] bg-[rgba(0,0,0,0.3)] p-3 text-sm" placeholder="prejemnik@email.com" />
            <label className="text-xs uppercase tracking-[0.1em] text-[#e7d2b5]">Ime prejemnika</label>
            <input name="recipientName" className="rounded-xl border border-[var(--line)] bg-[rgba(0,0,0,0.3)] p-3 text-sm" placeholder="Ime in priimek" />
            <label className="text-xs uppercase tracking-[0.1em] text-[#e7d2b5]">Email kupca</label>
            <input name="purchaserEmail" type="email" className="rounded-xl border border-[var(--line)] bg-[rgba(0,0,0,0.3)] p-3 text-sm" placeholder="kupca@email.com" />
            <button className="pill-btn border-[var(--gold)] bg-[var(--gold)] text-[#25190f]" type="submit">
              Kupi darilni bon
            </button>
            <p className="text-sm text-[#f0c189]">{giftMessage}</p>
          </form>
          <div className="panel p-5">
            <h3 className="display-font text-4xl text-[var(--gold)]">Aktivacija bona</h3>
            <p className="mt-2 text-sm leading-7 text-[#dbc8ad]">
              Kodo iz emaila vpises v kosarici v polje za kupon. Sistem preveri varnostni podpis kode in jo aktivira.
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-[#dbc8ad]">
              <li>Koda je unikatna in kriptografsko podpisana.</li>
              <li>Bon se po uporabi oznaci kot porabljen.</li>
              <li>Popust se odsteje pred izracunom postnine.</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="faq" className="mx-auto w-[min(1180px,92%)] py-12">
        <h2 className="display-font text-4xl text-[#fff5e8] md:text-5xl">Pogosta vprasanja</h2>
        <div className="mt-4 grid gap-3">
          <article className="panel p-5">
            <h3 className="display-font text-3xl">Kako dolgo traja dostava?</h3>
            <p className="mt-2 text-sm text-[#dbc8ad]">Standardna dostava je 2-5 dni, personalizirane svece 3-7 dni.</p>
          </article>
          <article className="panel p-5">
            <h3 className="display-font text-3xl">Ali lahko vrnem izdelek?</h3>
            <p className="mt-2 text-sm text-[#dbc8ad]">Da, v 14 dneh za nerabljene izdelke v originalni embalazi.</p>
          </article>
          <article className="panel p-5">
            <h3 className="display-font text-3xl">Kako uporabim darilni bon?</h3>
            <p className="mt-2 text-sm text-[#dbc8ad]">Kodo iz emaila vpises v polje kupon in kliknes Uporabi.</p>
          </article>
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

      {openedProduct ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[rgba(6,5,4,0.78)] p-3" onClick={() => setOpenedProduct(null)}>
          <article
            className="panel max-h-[92vh] w-full max-w-4xl overflow-auto p-5"
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.1em] text-[#f0c189]">{categoryLabel(openedProduct.category, lang)}</p>
                <h3 className="display-font mt-2 text-5xl text-[#fff8ec]">{openedProduct.name}</h3>
                <p className="mt-1 text-sm text-[#e0ccb1]">{openedProduct.scent}</p>
              </div>
              <button className="pill-btn" onClick={() => setOpenedProduct(null)}>
                Zapri
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-[330px_1fr]">
              <img src={productImage(openedProduct)} alt={openedProduct.name} className="aspect-square w-full rounded-2xl border border-[var(--line)] object-cover" />
              <div>
                <p className="text-sm leading-8 text-[#dbc8ad]">{openedProduct.description}</p>
                <div className="mt-4 grid gap-2 text-sm text-[#dbc8ad] md:grid-cols-2">
                  <p className="rounded-xl border border-[var(--line)] px-3 py-2">Cena: {formatPrice(Number((effectivePrice(openedProduct) * (1 - seasonExtra / 100)).toFixed(2)))}</p>
                  <p className="rounded-xl border border-[var(--line)] px-3 py-2">
                    {Number(openedProduct.stock || 0) > 0 ? t.stock(openedProduct.stock) : t.outOfStock(openedProduct.etaDays)}
                  </p>
                </div>
                <p className="mt-3 rounded-xl border border-[var(--line)] px-3 py-2 text-sm text-[#dbc8ad]">Rocna izdelava premium voska, cisti burn in dolgotrajen vonj.</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button className="pill-btn border-[var(--gold)] bg-[var(--gold)] text-[#25190f]" onClick={() => addCatalogProduct(openedProduct)}>
                    {t.addToCart}
                  </button>
                  <button className="pill-btn" onClick={() => setOpenedProduct(null)}>
                    Zapri
                  </button>
                </div>
              </div>
            </div>
          </article>
        </div>
      ) : null}

      <footer className="mx-auto w-[min(1180px,92%)] border-t border-[var(--line)] py-8">
        <div className="grid gap-6 md:grid-cols-[1fr_1fr_1fr]">
          <div>
            <p className="display-font text-3xl text-[var(--gold)]">Help & Support</p>
            <div className="mt-3 grid gap-1 text-sm text-[#dbc8ad]">
              <a href="/help" className="hover:text-[var(--gold)]">Center za pomoc</a>
              <a href="/policy/privacy" className="hover:text-[var(--gold)]">Privacy Policy</a>
              <a href="/policy/terms" className="hover:text-[var(--gold)]">Terms & Conditions</a>
              <a href="/policy/shipping" className="hover:text-[var(--gold)]">Shipping & Returns</a>
              <a href="/faq" className="hover:text-[var(--gold)]">FAQ</a>
            </div>
          </div>

          <div>
            <p className="display-font text-3xl text-[var(--gold)]">Placila</p>
            <PaymentLogos />
          </div>

          <div>
            <p className="display-font text-3xl text-[var(--gold)]">Social</p>
            <div className="mt-3 flex gap-2">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="grid h-10 w-10 place-items-center rounded-full border border-[var(--line)]">
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1.2" className="fill-current stroke-0"/></svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="grid h-10 w-10 place-items-center rounded-full border border-[var(--line)]">
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current"><path d="M13.5 4h3V0h-3.2C9.8 0 8 2.2 8 5.7V9H5v4h3v11h4.6V13h3.2l.7-4h-3.9V6c0-1.2.4-2 1.9-2Z"/></svg>
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="grid h-10 w-10 place-items-center rounded-full border border-[var(--line)]">
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current"><path d="M17.3 2c.2 1.8 1.2 3 2.9 3.5v3.4a7.1 7.1 0 0 1-3-.7v6.8a6 6 0 1 1-6-6h.5v3.2h-.5a2.8 2.8 0 1 0 2.8 2.8V2h3.3Z"/></svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="grid h-10 w-10 place-items-center rounded-full border border-[var(--line)]">
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current"><path d="M23 7.6a3.2 3.2 0 0 0-2.2-2.3C18.8 4.8 12 4.8 12 4.8s-6.8 0-8.8.5A3.2 3.2 0 0 0 1 7.6 33 33 0 0 0 .5 12c0 1.5.2 3 .5 4.4a3.2 3.2 0 0 0 2.2 2.3c2 .5 8.8.5 8.8.5s6.8 0 8.8-.5a3.2 3.2 0 0 0 2.2-2.3c.3-1.4.5-2.9.5-4.4s-.2-3-.5-4.4ZM10 15.5V8.5L16 12l-6 3.5Z"/></svg>
              </a>
            </div>
          </div>
        </div>
        <p className="mt-8 text-xs text-[#c8b094]">Copyright (c) {new Date().getFullYear()} SAROMEN. Vse pravice pridrzane.</p>
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
                setActiveVoucher(null);
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
          <div className="mt-3">
            <p className="text-[10px] uppercase tracking-[0.1em] text-[#d6be9e]">Varna placila</p>
            <PaymentLogos compact />
          </div>
          <p className="mt-2 text-xs text-[#f0c189]">{checkoutMessage}</p>
        </div>
      </aside>
    </div>
  );
}
