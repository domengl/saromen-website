"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");

  async function onSubmit(event) {
    event.preventDefault();
    if (password !== confirm) {
      setMessage("Gesli se ne ujemata.");
      return;
    }

    setMessage("Ustvarjam profil...");
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.message || "Registracija ni uspela.");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <main className="mx-auto grid min-h-screen w-[min(460px,92%)] place-items-center py-10">
      <div className="panel w-full p-6">
        <h1 className="display-font text-5xl text-[var(--gold)]">Registracija</h1>
        <p className="mt-2 text-sm text-[#dbc8ad]">Ustvari profil za nakup, racune in sledenje posiljk.</p>
        <form className="mt-5 grid gap-3" onSubmit={onSubmit}>
          <input className="rounded-xl border border-[var(--line)] bg-[rgba(0,0,0,0.32)] p-3 text-sm" required placeholder="Ime" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="rounded-xl border border-[var(--line)] bg-[rgba(0,0,0,0.32)] p-3 text-sm" type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="rounded-xl border border-[var(--line)] bg-[rgba(0,0,0,0.32)] p-3 text-sm" type="password" required minLength={6} placeholder="Geslo" value={password} onChange={(e) => setPassword(e.target.value)} />
          <input className="rounded-xl border border-[var(--line)] bg-[rgba(0,0,0,0.32)] p-3 text-sm" type="password" required minLength={6} placeholder="Potrdi geslo" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          <button className="pill-btn border-[var(--gold)] bg-[var(--gold)] text-[#25190f]" type="submit">
            Ustvari profil
          </button>
        </form>
        <p className="mt-2 text-sm text-[#f0c189]">{message}</p>
      </div>
    </main>
  );
}
