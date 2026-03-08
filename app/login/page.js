"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function onSubmit(event) {
    event.preventDefault();
    setMessage("Prijava v teku...");
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.message || "Prijava ni uspela.");
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <main className="mx-auto grid min-h-screen w-[min(460px,92%)] place-items-center py-10">
      <div className="panel w-full p-6">
        <h1 className="display-font text-5xl text-[var(--gold)]">Prijava</h1>
        <p className="mt-2 text-sm text-[#dbc8ad]">Prijavi se v SAROMEN profil za checkout in sledenje narocil.</p>
        <form className="mt-5 grid gap-3" onSubmit={onSubmit}>
          <input className="rounded-xl border border-[var(--line)] bg-[rgba(0,0,0,0.32)] p-3 text-sm" type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="rounded-xl border border-[var(--line)] bg-[rgba(0,0,0,0.32)] p-3 text-sm" type="password" required placeholder="Geslo" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="pill-btn border-[var(--gold)] bg-[var(--gold)] text-[#25190f]" type="submit">
            Prijava
          </button>
        </form>
        <p className="mt-2 text-sm text-[#f0c189]">{message}</p>
        <p className="mt-4 text-sm text-[#dbc8ad]">
          Nimas profila?{" "}
          <a href="/register" className="text-[var(--gold)] underline">
            Registracija
          </a>
        </p>
      </div>
    </main>
  );
}
