"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function formatPrice(value) {
  return `EUR ${Number(value || 0).toFixed(2)}`;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

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
        <p className="text-sm text-[#dbc8ad]">Nalaganje profila...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-[min(1080px,92%)] py-10">
      <section className="panel p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="display-font text-5xl text-[var(--gold)]">Moj Profil</h1>
            <p className="mt-2 text-sm text-[#dbc8ad]">
              {user.name} / {user.email}
            </p>
          </div>
          <div className="flex gap-2">
            <a href="/" className="pill-btn">
              Nazaj na trgovino
            </a>
            <button className="pill-btn" onClick={logout}>
              Odjava
            </button>
          </div>
        </div>
      </section>

      <section className="panel mt-4 p-6">
        <h2 className="display-font text-4xl text-[#fff5e8]">Narocila in sledenje</h2>
        <p className="mt-2 text-sm text-[#dbc8ad]">Racuni in tracking stevilke iz checkout flowa.</p>
        <div className="mt-4 grid gap-3">
          {orders.length === 0 ? <div className="rounded-xl border border-dashed border-[var(--line)] p-4 text-sm text-[#cfbc9f]">Se ni zakljucenih narocil.</div> : null}
          {orders.map((order) => (
            <article key={order.id} className="rounded-xl border border-[var(--line)] p-4 text-sm text-[#dbc8ad]">
              <p>
                <strong>Narocilo:</strong> {order.orderNumber}
              </p>
              <p>
                <strong>Racun:</strong> {order.invoiceNumber}
              </p>
              <p>
                <strong>Tracking:</strong> {order.trackingNumber}
              </p>
              <p>
                <strong>Status:</strong> {order.status}
              </p>
              <p>
                <strong>Skupaj:</strong> {formatPrice(order.total)}
              </p>
              <p>
                <strong>Datum:</strong> {new Date(order.createdAt).toLocaleString("sl-SI")}
              </p>
            </article>
          ))}
        </div>
      </section>

      <p className="mt-3 text-sm text-[#f0c189]">{message}</p>
    </main>
  );
}
