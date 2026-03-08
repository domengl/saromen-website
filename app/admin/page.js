"use client";

import { useEffect, useState } from "react";
import LanguageSwitcher, { useLanguage } from "@/components/language-switcher";

export default function AdminPage() {
  const [lang, setLang] = useLanguage("sl");
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [products, setProducts] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [offers, setOffers] = useState([]);
  const [productForm, setProductForm] = useState({
    name: "",
    category: "",
    scent: "",
    description: "",
    price: "39",
    stock: "10",
    etaDays: "5",
    salePercent: "0",
    isTop: false,
    isNew: false
  });
  const [couponForm, setCouponForm] = useState({ code: "", percent: "10", minAmount: "0" });
  const [offerForm, setOfferForm] = useState({
    id: "",
    title: "",
    description: "",
    percent: "10",
    active: true,
    startAt: "",
    endAt: ""
  });
  const [statusForm, setStatusForm] = useState({ orderNumber: "", status: "PENDING", note: "" });

  useEffect(() => {
    const load = async () => {
      const [meRes, productsRes, couponsRes, offersRes] = await Promise.all([
        fetch("/api/auth/me"),
        fetch("/api/products"),
        fetch("/api/coupons"),
        fetch("/api/admin/special-offers")
      ]);
      const meJson = await meRes.json();
      const productsJson = await productsRes.json();
      const couponsJson = await couponsRes.json();
      const offersJson = await offersRes.json();
      setUser(meJson.user || null);
      setProducts(productsJson.items || []);
      setCoupons(couponsJson.items || []);
      setOffers(offersJson.items || []);
    };
    load();
  }, []);

  async function addProduct(event) {
    event.preventDefault();
    const response = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...productForm,
        price: Number(productForm.price),
        stock: Number(productForm.stock),
        etaDays: Number(productForm.etaDays),
        salePercent: Number(productForm.salePercent)
      })
    });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.message || "Izdelek ni bil dodan.");
      return;
    }
    setProducts((prev) => [data.item, ...prev]);
    setMessage("Izdelek dodan.");
  }

  async function addCoupon(event) {
    event.preventDefault();
    const response = await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...couponForm,
        percent: Number(couponForm.percent),
        minAmount: Number(couponForm.minAmount)
      })
    });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.message || "Kupon ni bil dodan.");
      return;
    }
    setCoupons((prev) => [data.item, ...prev]);
    setMessage("Kupon dodan.");
  }

  async function saveOffer(event) {
    event.preventDefault();
    const response = await fetch("/api/admin/special-offers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...offerForm,
        percent: Number(offerForm.percent),
        id: offerForm.id || undefined
      })
    });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.message || "Posebna ugodnost ni bila shranjena.");
      return;
    }
    setOffers((prev) => [data.item, ...prev.filter((item) => item.id !== data.item.id)]);
    setMessage("Posebna ugodnost shranjena (admin-only).");
  }

  async function updateOrderStatus(event) {
    event.preventDefault();
    const response = await fetch("/api/admin/orders/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(statusForm)
    });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.message || "Status narocila ni bil posodobljen.");
      return;
    }
    setMessage(`Status za ${statusForm.orderNumber} je posodobljen.`);
  }

  async function syncSheets() {
    const response = await fetch("/api/admin/sheets/sync", { method: "POST" });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.message || "Google Sheets sync ni uspel.");
      return;
    }
    setMessage(`Google Sheets sync OK (products: ${data.products}, coupons: ${data.coupons}).`);
  }

  if (!user) {
    return (
      <main className="mx-auto w-[min(980px,92%)] py-10">
        <section className="panel p-6">
          <div className="mb-4 flex justify-end">
            <LanguageSwitcher lang={lang} setLang={setLang} />
          </div>
          <h1 className="display-font text-5xl text-[var(--gold)]">Admin Center</h1>
          <p className="mt-3 text-sm text-[#dbc8ad]">Za dostop se prijavi z admin uporabnikom.</p>
          <a href="/login" className="pill-btn mt-4 inline-flex">
            Login
          </a>
        </section>
      </main>
    );
  }

  if (user.role !== "admin") {
    return (
      <main className="mx-auto w-[min(980px,92%)] py-10">
        <section className="panel p-6">
          <div className="mb-4 flex justify-end">
            <LanguageSwitcher lang={lang} setLang={setLang} />
          </div>
          <h1 className="display-font text-5xl text-[var(--gold)]">Admin Center</h1>
          <p className="mt-3 text-sm text-[#dbc8ad]">Ta racun nima admin pravic.</p>
          <a href="/profile" className="pill-btn mt-4 inline-flex">
            Profil
          </a>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto w-[min(1180px,92%)] py-10">
      <section className="panel p-6">
        <div className="mb-4 flex justify-end">
          <LanguageSwitcher lang={lang} setLang={setLang} />
        </div>
        <h1 className="display-font text-5xl text-[var(--gold)]">Admin Center</h1>
        <p className="mt-2 text-sm text-[#dbc8ad]">Prijavljen kot: {user.email}</p>
        <p className="mt-2 text-sm text-[#f0c189]">{message}</p>
      </section>

      <section className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="panel p-6">
          <h2 className="display-font text-4xl">Dodaj Izdelek</h2>
          <form className="mt-3 grid gap-2" onSubmit={addProduct}>
            <input className="rounded-xl border border-[var(--line)] bg-[rgba(0,0,0,0.32)] p-3 text-sm" placeholder="Naziv" value={productForm.name} onChange={(e) => setProductForm((p) => ({ ...p, name: e.target.value }))} />
            <input className="rounded-xl border border-[var(--line)] bg-[rgba(0,0,0,0.32)] p-3 text-sm" placeholder="Kategorija" value={productForm.category} onChange={(e) => setProductForm((p) => ({ ...p, category: e.target.value }))} />
            <input className="rounded-xl border border-[var(--line)] bg-[rgba(0,0,0,0.32)] p-3 text-sm" placeholder="Vonj" value={productForm.scent} onChange={(e) => setProductForm((p) => ({ ...p, scent: e.target.value }))} />
            <textarea className="rounded-xl border border-[var(--line)] bg-[rgba(0,0,0,0.32)] p-3 text-sm" placeholder="Opis" value={productForm.description} onChange={(e) => setProductForm((p) => ({ ...p, description: e.target.value }))} />
            <div className="grid grid-cols-2 gap-2">
              <input className="rounded-xl border border-[var(--line)] bg-[rgba(0,0,0,0.32)] p-3 text-sm" type="number" step="0.01" placeholder="Cena" value={productForm.price} onChange={(e) => setProductForm((p) => ({ ...p, price: e.target.value }))} />
              <input className="rounded-xl border border-[var(--line)] bg-[rgba(0,0,0,0.32)] p-3 text-sm" type="number" placeholder="Zaloga" value={productForm.stock} onChange={(e) => setProductForm((p) => ({ ...p, stock: e.target.value }))} />
              <input className="rounded-xl border border-[var(--line)] bg-[rgba(0,0,0,0.32)] p-3 text-sm" type="number" placeholder="ETA dni" value={productForm.etaDays} onChange={(e) => setProductForm((p) => ({ ...p, etaDays: e.target.value }))} />
              <input className="rounded-xl border border-[var(--line)] bg-[rgba(0,0,0,0.32)] p-3 text-sm" type="number" placeholder="Popust %" value={productForm.salePercent} onChange={(e) => setProductForm((p) => ({ ...p, salePercent: e.target.value }))} />
            </div>
            <div className="flex gap-3 text-sm">
              <label>
                <input type="checkbox" checked={productForm.isTop} onChange={(e) => setProductForm((p) => ({ ...p, isTop: e.target.checked }))} /> Top hit
              </label>
              <label>
                <input type="checkbox" checked={productForm.isNew} onChange={(e) => setProductForm((p) => ({ ...p, isNew: e.target.checked }))} /> Novost
              </label>
            </div>
            <button className="pill-btn border-[var(--gold)] bg-[var(--gold)] text-[#25190f]" type="submit">
              Shrani izdelek
            </button>
          </form>
        </div>

        <div className="panel p-6">
          <h2 className="display-font text-4xl">Dodaj Kupon</h2>
          <form className="mt-3 grid gap-2" onSubmit={addCoupon}>
            <input className="rounded-xl border border-[var(--line)] bg-[rgba(0,0,0,0.32)] p-3 text-sm" placeholder="Koda" value={couponForm.code} onChange={(e) => setCouponForm((p) => ({ ...p, code: e.target.value }))} />
            <input className="rounded-xl border border-[var(--line)] bg-[rgba(0,0,0,0.32)] p-3 text-sm" type="number" placeholder="Popust %" value={couponForm.percent} onChange={(e) => setCouponForm((p) => ({ ...p, percent: e.target.value }))} />
            <input className="rounded-xl border border-[var(--line)] bg-[rgba(0,0,0,0.32)] p-3 text-sm" type="number" step="0.01" placeholder="Minimalni znesek" value={couponForm.minAmount} onChange={(e) => setCouponForm((p) => ({ ...p, minAmount: e.target.value }))} />
            <button className="pill-btn border-[var(--gold)] bg-[var(--gold)] text-[#25190f]" type="submit">
              Shrani kupon
            </button>
          </form>

          <h3 className="display-font mt-6 text-3xl">Aktivni kuponi</h3>
          <ul className="mt-3 grid gap-2 text-sm text-[#dbc8ad]">
            {coupons.map((coupon) => (
              <li key={coupon.id} className="rounded-xl border border-[var(--line)] p-3">
                {coupon.code} - {coupon.percent}% (min EUR {Number(coupon.minAmount).toFixed(2)})
              </li>
            ))}
          </ul>
        </div>

        <div className="panel p-6">
          <h2 className="display-font text-4xl">Posebne Ugodnosti</h2>
          <p className="mt-2 text-sm text-[#dbc8ad]">To sekcijo ureja samo admin. Podatki se zapisujejo v Google Sheets.</p>
          <form className="mt-3 grid gap-2" onSubmit={saveOffer}>
            <input className="rounded-xl border border-[var(--line)] bg-[rgba(0,0,0,0.32)] p-3 text-sm" placeholder="ID (opcijsko)" value={offerForm.id} onChange={(e) => setOfferForm((p) => ({ ...p, id: e.target.value }))} />
            <input className="rounded-xl border border-[var(--line)] bg-[rgba(0,0,0,0.32)] p-3 text-sm" placeholder="Naslov" value={offerForm.title} onChange={(e) => setOfferForm((p) => ({ ...p, title: e.target.value }))} />
            <textarea className="rounded-xl border border-[var(--line)] bg-[rgba(0,0,0,0.32)] p-3 text-sm" placeholder="Opis" value={offerForm.description} onChange={(e) => setOfferForm((p) => ({ ...p, description: e.target.value }))} />
            <input className="rounded-xl border border-[var(--line)] bg-[rgba(0,0,0,0.32)] p-3 text-sm" type="number" placeholder="Popust %" value={offerForm.percent} onChange={(e) => setOfferForm((p) => ({ ...p, percent: e.target.value }))} />
            <input className="rounded-xl border border-[var(--line)] bg-[rgba(0,0,0,0.32)] p-3 text-sm" type="datetime-local" placeholder="Zacetek" value={offerForm.startAt} onChange={(e) => setOfferForm((p) => ({ ...p, startAt: e.target.value }))} />
            <input className="rounded-xl border border-[var(--line)] bg-[rgba(0,0,0,0.32)] p-3 text-sm" type="datetime-local" placeholder="Konec" value={offerForm.endAt} onChange={(e) => setOfferForm((p) => ({ ...p, endAt: e.target.value }))} />
            <label className="text-sm">
              <input type="checkbox" checked={offerForm.active} onChange={(e) => setOfferForm((p) => ({ ...p, active: e.target.checked }))} /> Aktivna ugodnost
            </label>
            <button className="pill-btn border-[var(--gold)] bg-[var(--gold)] text-[#25190f]" type="submit">
              Shrani ugodnost
            </button>
          </form>
          <ul className="mt-4 grid gap-2 text-sm text-[#dbc8ad]">
            {offers.map((offer) => (
              <li key={offer.id} className="rounded-xl border border-[var(--line)] p-3">
                <strong>{offer.title}</strong> - {offer.percent}% ({offer.active ? "active" : "inactive"})
              </li>
            ))}
          </ul>
        </div>

        <div className="panel p-6">
          <h2 className="display-font text-4xl">Sheets Ops</h2>
          <button className="pill-btn" onClick={syncSheets}>
            Sync products + coupons v Google Sheets
          </button>
          <form className="mt-4 grid gap-2" onSubmit={updateOrderStatus}>
            <h3 className="display-font text-3xl">Status narocila</h3>
            <input className="rounded-xl border border-[var(--line)] bg-[rgba(0,0,0,0.32)] p-3 text-sm" placeholder="Order number (npr. SAR-ABC123)" value={statusForm.orderNumber} onChange={(e) => setStatusForm((p) => ({ ...p, orderNumber: e.target.value }))} />
            <select className="rounded-xl border border-[var(--line)] bg-[rgba(0,0,0,0.32)] p-3 text-sm" value={statusForm.status} onChange={(e) => setStatusForm((p) => ({ ...p, status: e.target.value }))}>
              <option value="PENDING">PENDING</option>
              <option value="PAID">PAID</option>
              <option value="FAILED">FAILED</option>
              <option value="SHIPPED">SHIPPED</option>
              <option value="DELIVERED">DELIVERED</option>
            </select>
            <input className="rounded-xl border border-[var(--line)] bg-[rgba(0,0,0,0.32)] p-3 text-sm" placeholder="Opomba (opcijsko)" value={statusForm.note} onChange={(e) => setStatusForm((p) => ({ ...p, note: e.target.value }))} />
            <button className="pill-btn border-[var(--gold)] bg-[var(--gold)] text-[#25190f]" type="submit">
              Posodobi status
            </button>
          </form>
        </div>

        <div className="panel p-6 lg:col-span-2">
          <h2 className="display-font text-4xl">Aktivni izdelki</h2>
          <div className="mt-3 grid gap-2 text-sm text-[#dbc8ad] md:grid-cols-2">
            {products.map((product) => (
              <article key={product.id} className="rounded-xl border border-[var(--line)] p-3">
                <strong>{product.name}</strong> ({product.category}) - EUR {Number(product.price).toFixed(2)} / zaloga {product.stock}
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
