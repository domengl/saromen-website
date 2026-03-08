"use client";

import { useEffect, useMemo, useState } from "react";

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

export default function Storefront() {
  const [products, setProducts] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [category, setCategory] = useState("Vse");
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [activeCoupon, setActiveCoupon] = useState(null);
  const [couponMessage, setCouponMessage] = useState("");
  const [checkoutMessage, setCheckoutMessage] = useState("");
  const [user, setUser] = useState(null);
  const [customMessage, setCustomMessage] = useState("");

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

  const categories = useMemo(() => ["Vse", ...new Set(products.map((item) => item.category))], [products]);
  const topHits = useMemo(() => products.filter((item) => item.isTop), [products]);
  const discounts = useMemo(() => products.filter((item) => item.salePercent > 0), [products]);
  const novosti = useMemo(() => products.filter((item) => item.isNew), [products]);
  const catalog = useMemo(
    () => (category === "Vse" ? products : products.filter((item) => item.category === category)),
    [category, products]
  );

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

    const lineId = preorder ? `catalog-${product.id}-pre` : `catalog-${product.id}-stock`;
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
          unitPrice: effectivePrice(product),
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
        unitPrice: 49 + (logoName ? 6 : 0),
        preorder: true,
        etaDays: 7,
        note: `Napis: ${text}${logoName ? `, Logo: ${logoName}` : ""}`
      }
    ]);

    setCustomMessage("Personalizirana sveca je dodana v kosarico.");
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
      setCouponMessage("Kupon ne obstaja.");
      return;
    }
    if (totals.subtotal < found.minAmount) {
      setCouponMessage(`Minimalni znesek za kupon je ${formatPrice(found.minAmount)}.`);
      return;
    }
    setActiveCoupon(found);
    setCouponMessage(`Kupon ${found.code} aktiviran (-${found.percent}%).`);
  }

  async function checkout() {
    if (!cart.length) return;
    if (!user) {
      setCheckoutMessage("Za checkout se prijavi v profil.");
      return;
    }

    setCheckoutMessage("Pripravljam checkout...");
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
      setCheckoutMessage(data.message || "Checkout ni uspel.");
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
            const currentPrice = effectivePrice(product);
            const available = availableNow(product);
            const canPreorder = product.etaDays > 0;
            const disabled = available <= 0 && !canPreorder;
            return (
              <article key={product.id} className="panel flex min-h-[420px] flex-col p-4">
                <img src={productImage(product)} alt={product.name} className="mb-3 aspect-square w-full rounded-xl border border-[var(--line)] object-cover" />
                <div className="mb-2 flex flex-wrap gap-1">
                  <span className="rounded-full border border-[var(--line)] px-2 py-1 text-[10px] uppercase tracking-[0.08em]">{product.category}</span>
                  {product.isTop ? <span className="rounded-full border border-[var(--gold)] px-2 py-1 text-[10px] uppercase tracking-[0.08em] text-[var(--gold)]">Top hit</span> : null}
                  {product.isNew ? <span className="rounded-full border border-[var(--gold)] px-2 py-1 text-[10px] uppercase tracking-[0.08em] text-[var(--gold)]">Novost</span> : null}
                  {product.salePercent ? (
                    <span className="rounded-full border border-[var(--gold)] px-2 py-1 text-[10px] uppercase tracking-[0.08em] text-[var(--gold)]">-{product.salePercent}%</span>
                  ) : null}
                </div>
                <h3 className="display-font text-4xl text-[#fff8ec]">{product.name}</h3>
                <p className="mb-2 text-sm text-[#dec8ad]">{product.scent}</p>
                <p className="mb-3 flex-grow text-sm leading-7 text-[#d7c6af]">{product.description}</p>
                <p className={`mb-3 text-xs ${available > 0 ? "text-[#e5d4be]" : "text-[#f3bb7c]"}`}>
                  {available > 0 ? `Na zalogi: ${available} kos` : `Ni na zalogi. Dobava: ${product.etaDays} dni.`}
                </p>
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-lg font-bold text-[var(--gold)]">{formatPrice(currentPrice)}</span>
                  {product.salePercent ? <span className="text-sm text-[#96836a] line-through">{formatPrice(product.price)}</span> : null}
                </div>
                <button className="pill-btn" disabled={disabled} onClick={() => addCatalogProduct(product)}>
                  {available > 0 ? "Dodaj v kosarico" : canPreorder ? `Prednaroci (${product.etaDays} dni)` : "Ni na voljo"}
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
          <p className="display-font text-4xl uppercase tracking-[0.09em] text-[#ffd7a2] md:text-6xl">TESTNA SPLETNA STRAN</p>
          <p className="mt-2 text-xs uppercase tracking-[0.11em] text-[#ffd7a2] md:text-sm">
            Pravno obvestilo: ne odgovarjamo za nastale tezave, napake ali posledice uporabe te testne spletne strani.
          </p>
        </div>
      </div>

      <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-[rgba(15,13,11,0.9)] backdrop-blur-md">
        <div className="mx-auto flex w-[min(1180px,92%)] flex-wrap items-center justify-between gap-4 py-4">
          <a href="#home" className="display-font text-4xl tracking-[0.2em] text-[var(--gold)]">
            SAROMEN
          </a>
          <nav className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.11em] text-[#f3e7d5]">
            <a href="#top-hiti">Top Hiti</a>
            <a href="#popusti">Popusti</a>
            <a href="#novosti">Novosti</a>
            <a href="#blog">Blog</a>
            <a href="#kontakt">Kontakt</a>
          </nav>
          <div className="flex flex-wrap items-center gap-2">
            {user ? (
              <>
                <a href="/profile" className="pill-btn">
                  {user.name}
                </a>
                <button className="pill-btn" onClick={logout}>
                  Odjava
                </button>
              </>
            ) : (
              <a href="/login" className="pill-btn">
                Prijava
              </a>
            )}
            <a href="/admin" className="pill-btn">
              Admin
            </a>
            <button className="pill-btn" onClick={() => setCartOpen(true)}>
              Kosarica ({cartCount})
            </button>
          </div>
        </div>
      </header>

      <section id="home" className="mx-auto grid w-[min(1180px,92%)] gap-6 py-14 md:grid-cols-[1.35fr_0.65fr] md:items-center">
        <div>
          <img src="/assets/saromen-logo.png" alt="SAROMEN logo" className="mb-4 w-[min(420px,90%)] rounded-2xl border border-[var(--line)] shadow-glow" />
          <span className="inline-block rounded-full border border-[var(--line)] px-4 py-2 text-[11px] uppercase tracking-[0.15em] text-[var(--beige)]">
            Luxury Candle Brand
          </span>
          <h1 className="display-font mt-4 text-5xl leading-[0.96] text-[#fff8ec] md:text-7xl">Svece kot atmosfera, dizajn in osebna zgodba.</h1>
          <p className="mt-5 max-w-2xl text-lg text-[#e4d5bf]">
            Premium candle ecommerce za SAROMEN: top hiti, popusti, novosti, personalizirane svece, kuponi, izracun postnine in Stripe checkout.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#shop" className="pill-btn border-[var(--gold)] bg-[var(--gold)] text-[#25190f]">
              Nakupuj kolekcijo
            </a>
            <a href="#about" className="pill-btn">
              Zgodba Sara + Domen
            </a>
          </div>
        </div>
        <div className="grid gap-3">
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
        <ProductSection title="Top Hiti" intro="Najbolj prodajani premium modeli." items={topHits} />
      </div>
      <div id="popusti">
        <ProductSection title="Popusti" intro="Aktualne akcije in kuponske kombinacije." items={discounts} />
      </div>
      <div id="novosti">
        <ProductSection title="Novosti" intro="Sveze kolekcije in novi vonji." items={novosti} />
      </div>

      <section id="shop" className="mx-auto w-[min(1180px,92%)] py-12">
        <h2 className="display-font text-4xl text-[#fff5e8] md:text-5xl">Seznam Svec</h2>
        <p className="mb-6 mt-2 max-w-2xl text-[#dac7ae]">Razlicna podrocja: disavne, dekorativne, modni dodatek in darilne linije.</p>
        <div className="mb-5 flex flex-wrap gap-2">
          {categories.map((item) => (
            <button key={item} className={`pill-btn ${item === category ? "border-[var(--gold)] text-[var(--gold)]" : ""}`} onClick={() => setCategory(item)}>
              {item}
            </button>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {catalog.map((product) => (
            <article key={product.id} className="panel flex min-h-[410px] flex-col p-4">
              <img src={productImage(product)} alt={product.name} className="mb-3 aspect-square w-full rounded-xl border border-[var(--line)] object-cover" />
              <h3 className="display-font text-4xl text-[#fff8ec]">{product.name}</h3>
              <p className="text-sm text-[#dec8ad]">{product.scent}</p>
              <p className="mb-4 mt-2 flex-grow text-sm leading-7 text-[#d7c6af]">{product.description}</p>
              <button className="pill-btn" onClick={() => addCatalogProduct(product)}>
                Dodaj
              </button>
            </article>
          ))}
        </div>
      </section>

      <section id="personalized" className="mx-auto w-[min(1180px,92%)] py-12">
        <h2 className="display-font text-4xl text-[#fff5e8] md:text-5xl">Personalizirane Svece</h2>
        <p className="mb-6 mt-2 max-w-2xl text-[#dac7ae]">Napis, logo in vonj po meri. Rok izdelave: 3-7 dni.</p>
        <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
          <form className="panel grid gap-2 p-5" onSubmit={addPersonalized}>
            <label className="text-xs uppercase tracking-[0.1em] text-[#e7d2b5]">Tip svece</label>
            <select name="base" required className="rounded-xl border border-[var(--line)] bg-[rgba(0,0,0,0.3)] p-3 text-sm">
              <option value="Signature Jar">Signature Jar</option>
              <option value="Wedding Edition">Wedding Edition</option>
              <option value="Corporate Gift">Corporate Gift</option>
            </select>
            <label className="text-xs uppercase tracking-[0.1em] text-[#e7d2b5]">Napis</label>
            <input name="text" required className="rounded-xl border border-[var(--line)] bg-[rgba(0,0,0,0.3)] p-3 text-sm" placeholder="Npr. Sara & Domen 2026" />
            <label className="text-xs uppercase tracking-[0.1em] text-[#e7d2b5]">Vonj</label>
            <input name="scent" required className="rounded-xl border border-[var(--line)] bg-[rgba(0,0,0,0.3)] p-3 text-sm" placeholder="Npr. Amber Vanilla" />
            <label className="text-xs uppercase tracking-[0.1em] text-[#e7d2b5]">Logo (opcija)</label>
            <input name="logo" type="file" accept=".png,.jpg,.jpeg,.svg" className="rounded-xl border border-[var(--line)] bg-[rgba(0,0,0,0.3)] p-3 text-sm" />
            <label className="text-xs uppercase tracking-[0.1em] text-[#e7d2b5]">Kolicina</label>
            <input name="qty" type="number" min="1" defaultValue="1" className="rounded-xl border border-[var(--line)] bg-[rgba(0,0,0,0.3)] p-3 text-sm" />
            <button className="pill-btn border-[var(--gold)] bg-[var(--gold)] text-[#25190f]" type="submit">
              Dodaj personalizirano
            </button>
            <p className="text-sm text-[#f0c189]">{customMessage}</p>
          </form>
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
      </section>

      <section id="about" className="mx-auto w-[min(1180px,92%)] py-12">
        <h2 className="display-font text-4xl text-[#fff5e8] md:text-5xl">O Nas: Sara in Domen</h2>
        <div className="panel mt-4 grid gap-3 p-5 text-sm leading-8 text-[#dbc8ad]">
          <p>Sara je oblikovalka z obcutkom za estetiko prostora, Domen pa podjetnik, ki obozuje gradnjo znamke in sistemsko rast.</p>
          <p>Iz njune ljubezni in skupne poslovne vizije je nastal SAROMEN: premium candle studio, kjer vsak produkt povezuje emocijo, dizajn in kakovost.</p>
          <p>Danes gradita sodobno spletno trgovino z osredotocenostjo na uporabnisko izkusnjo, personalizacijo in elegantno predstavitev izdelkov.</p>
        </div>
      </section>

      <section id="blog" className="mx-auto w-[min(1180px,92%)] py-12">
        <h2 className="display-font text-4xl text-[#fff5e8] md:text-5xl">Blog</h2>
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
            <p className="mt-2 text-sm leading-7 text-[#dbc8ad]">Kako izbrati napis, vonj in embalao za dogodke ali business gifting.</p>
          </article>
        </div>
      </section>

      <section id="kontakt" className="mx-auto w-[min(1180px,92%)] py-12">
        <h2 className="display-font text-4xl text-[#fff5e8] md:text-5xl">Kontakt</h2>
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
              <strong>Blog:</strong> saromen.com/#blog
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

      <aside
        className={`fixed right-0 top-0 z-40 flex h-full w-full max-w-[430px] flex-col border-l border-[var(--line)] bg-[#12100c] transition-transform ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-[var(--line)] px-4 py-4">
          <h3 className="display-font text-4xl text-[var(--gold)]">Kosarica</h3>
          <button className="pill-btn" onClick={() => setCartOpen(false)}>
            Zapri
          </button>
        </div>
        <div className="grid gap-2 overflow-auto p-4">
          {cart.length === 0 ? <div className="rounded-xl border border-dashed border-[var(--line)] p-4 text-sm text-[#cfbc9f]">Kosarica je prazna.</div> : null}
          {cart.map((item) => (
            <div key={item.id} className="rounded-xl border border-[var(--line)] p-3 text-sm">
              <div className="mb-1 flex justify-between gap-2">
                <span>{item.name}</span>
                <strong>{formatPrice(item.unitPrice * item.quantity)}</strong>
              </div>
              <div className="mb-2 text-xs text-[#d7c3a4]">
                {item.scent} / {item.preorder ? "Prednarocilo" : "Na zalogi"} / ETA {item.etaDays} dni
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
                  Odstrani
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-[var(--line)] p-4">
          <label className="mb-2 block text-xs uppercase tracking-[0.1em] text-[#e7d2b5]">Kupon</label>
          <div className="mb-2 flex gap-2">
            <input
              className="w-full rounded-xl border border-[var(--line)] bg-[rgba(0,0,0,0.35)] p-3 text-sm"
              value={couponCode}
              onChange={(event) => setCouponCode(event.target.value)}
              placeholder="Npr. SARA10"
            />
            <button className="pill-btn" onClick={applyCoupon}>
              Uporabi
            </button>
          </div>
          <p className="mb-2 text-xs text-[#eec28d]">{couponMessage}</p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Vmesni znesek</span>
              <strong>{formatPrice(totals.subtotal)}</strong>
            </div>
            <div className="flex justify-between">
              <span>Popust</span>
              <strong>- {formatPrice(totals.discount)}</strong>
            </div>
            <div className="flex justify-between">
              <span>Postnina</span>
              <strong>{formatPrice(totals.shipping)}</strong>
            </div>
            <div className="flex justify-between text-base">
              <span>Skupaj</span>
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
              Pocisti
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
