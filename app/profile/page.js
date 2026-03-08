"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LanguageSwitcher, { useLanguage } from "@/components/language-switcher";

function formatPrice(value) {
  return `EUR ${Number(value || 0).toFixed(2)}`;
}

const TEXT = {
  sl: {
    loading: "Nalaganje profila...",
    title: "Moj Profil",
    back: "Nazaj na trgovino",
    logout: "Odjava",
    admin: "Admin center",
    ordersTitle: "Narocila in sledenje",
    ordersSub: "Racuni in tracking stevilke iz checkout flowa.",
    noOrders: "Se ni zakljucenih narocil."
  },
  en: {
    loading: "Loading profile...",
    title: "My Profile",
    back: "Back to store",
    logout: "Logout",
    admin: "Admin center",
    ordersTitle: "Orders and tracking",
    ordersSub: "Invoices and tracking numbers from checkout flow.",
    noOrders: "No completed orders yet."
  },
  de: {
    loading: "Profil wird geladen...",
    title: "Mein Profil",
    back: "Zuruck zum Shop",
    logout: "Abmelden",
    admin: "Admin center",
    ordersTitle: "Bestellungen und Tracking",
    ordersSub: "Rechnungen und Trackingnummern aus dem Checkout-Flow.",
    noOrders: "Noch keine abgeschlossenen Bestellungen."
  }
};

export default function ProfilePage() {
  const router = useRouter();
  const [lang, setLang] = useLanguage("sl");
  const t = TEXT[lang] || TEXT.sl;
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const load = async () => {
      const [meRes, ordersRes] = await Promise.all([fetch("/api/auth/me"), fetch("/api/orders")]);
      const meJson = await meRes.json();
      const ordersJson = await ordersRes.json();

      if (!meJson.user) {
        router.push("/login");
        return;
      }

      setUser(meJson.user);
      setOrders(ordersJson.items || []);
    };

    load();
  }, [router]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  if (!user) {
    return (
      <main className="mx-auto grid min-h-screen w-[min(1080px,92%)] place-items-center py-10">
        <p className="text-sm text-[#dbc8ad]">{t.loading}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-[min(1080px,92%)] py-10">
      <section className="panel p-6">
        <div className="mb-4 flex justify-end">
          <LanguageSwitcher lang={lang} setLang={setLang} />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="display-font text-5xl text-[var(--gold)]">{t.title}</h1>
            <p className="mt-2 text-sm text-[#dbc8ad]">
              {user.name} / {user.email}
            </p>
          </div>
          <div className="flex gap-2">
            <a href="/" className="pill-btn">
              {t.back}
            </a>
            {user.role === "admin" ? (
              <a href="/admin" className="pill-btn">
                {t.admin}
              </a>
            ) : null}
            <button className="pill-btn" onClick={logout}>
              {t.logout}
            </button>
          </div>
        </div>
      </section>

      <section className="panel mt-4 p-6">
        <h2 className="display-font text-4xl text-[#fff5e8]">{t.ordersTitle}</h2>
        <p className="mt-2 text-sm text-[#dbc8ad]">{t.ordersSub}</p>
        <div className="mt-4 grid gap-3">
          {orders.length === 0 ? <div className="rounded-xl border border-dashed border-[var(--line)] p-4 text-sm text-[#cfbc9f]">{t.noOrders}</div> : null}
          {orders.map((order) => (
            <article key={order.id} className="rounded-xl border border-[var(--line)] p-4 text-sm text-[#dbc8ad]">
              <p>
                <strong>Order:</strong> {order.orderNumber}
              </p>
              <p>
                <strong>Invoice:</strong> {order.invoiceNumber}
              </p>
              <p>
                <strong>Tracking:</strong> {order.trackingNumber}
              </p>
              <p>
                <strong>Status:</strong> {order.status}
              </p>
              <p>
                <strong>Total:</strong> {formatPrice(order.total)}
              </p>
              <p>
                <strong>Date:</strong> {new Date(order.createdAt).toLocaleString("sl-SI")}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
