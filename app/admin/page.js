"use client";

import { useEffect, useState } from "react";
import LanguageSwitcher, { useLanguage } from "@/components/language-switcher";

export default function AdminPage() {
  const [lang, setLang] = useLanguage("sl");
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [products, setProducts] = useState([]);
  const [coupons, setCoupons] = useState([]);
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

  useEffect(() => {
    const load = async () => {
      const [meRes, productsRes, couponsRes] = await Promise.all([
        fetch("/api/auth/me"),
        fetch("/api/products"),
        fetch("/api/coupons")
      ]);
      const meJson = await meRes.json();
      const productsJson = await productsRes.json();
      const couponsJson = await couponsRes.json();
      setUser(meJson.user || null);
      setProducts(productsJson.items || []);
      setCoupons(couponsJson.items || []);
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
