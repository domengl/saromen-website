"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LanguageSwitcher, { useLanguage } from "@/components/language-switcher";

const TEXT = {
  sl: {
    title: "Registracija",
    subtitle: "Ustvari profil za nakup, racune in sledenje posiljk.",
    name: "Ime",
    email: "Email",
    password: "Geslo",
    confirm: "Potrdi geslo",
    submit: "Ustvari profil",
    mismatch: "Gesli se ne ujemata.",
    processing: "Ustvarjam profil...",
    failed: "Registracija ni uspela."
  },
  en: {
    title: "Register",
    subtitle: "Create your account for checkout, invoices, and shipping tracking.",
    name: "Name",
    email: "Email",
    password: "Password",
    confirm: "Confirm password",
    submit: "Create account",
    mismatch: "Passwords do not match.",
    processing: "Creating account...",
    failed: "Registration failed."
  },
  de: {
    title: "Registrierung",
    subtitle: "Erstelle ein Konto fur Checkout, Rechnungen und Tracking.",
    name: "Name",
    email: "Email",
    password: "Passwort",
    confirm: "Passwort bestatigen",
    submit: "Konto erstellen",
    mismatch: "Passworter stimmen nicht uberein.",
    processing: "Konto wird erstellt...",
    failed: "Registrierung fehlgeschlagen."
  }
};

export default function RegisterPage() {
  const router = useRouter();
  const [lang, setLang] = useLanguage("sl");
  const t = TEXT[lang] || TEXT.sl;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");

  async function onSubmit(event) {
    event.preventDefault();
    if (password !== confirm) {
      setMessage(t.mismatch);
      return;
    }

    setMessage(t.processing);
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.message || t.failed);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <main className="mx-auto grid min-h-screen w-[min(460px,92%)] place-items-center py-10">
      <div className="panel w-full p-6">
        <div className="mb-4 flex justify-end">
          <LanguageSwitcher lang={lang} setLang={setLang} />
        </div>
        <h1 className="display-font text-5xl text-[var(--gold)]">{t.title}</h1>
        <p className="mt-2 text-sm text-[#dbc8ad]">{t.subtitle}</p>
        <form className="mt-5 grid gap-3" onSubmit={onSubmit}>
          <input className="rounded-xl border border-[var(--line)] bg-[rgba(0,0,0,0.32)] p-3 text-sm" required placeholder={t.name} value={name} onChange={(e) => setName(e.target.value)} />
          <input className="rounded-xl border border-[var(--line)] bg-[rgba(0,0,0,0.32)] p-3 text-sm" type="email" required placeholder={t.email} value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="rounded-xl border border-[var(--line)] bg-[rgba(0,0,0,0.32)] p-3 text-sm" type="password" required minLength={6} placeholder={t.password} value={password} onChange={(e) => setPassword(e.target.value)} />
          <input className="rounded-xl border border-[var(--line)] bg-[rgba(0,0,0,0.32)] p-3 text-sm" type="password" required minLength={6} placeholder={t.confirm} value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          <button className="pill-btn border-[var(--gold)] bg-[var(--gold)] text-[#25190f]" type="submit">
            {t.submit}
          </button>
        </form>
        <p className="mt-2 text-sm text-[#f0c189]">{message}</p>
      </div>
    </main>
  );
}
