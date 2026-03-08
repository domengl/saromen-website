import StaticPage from "@/components/static-page";

export default function FaqPage() {
  return (
    <StaticPage title="FAQ" subtitle="Pogosta vprasanja in hitri odgovori.">
      <h2 className="display-font text-3xl text-[var(--gold)]">Kako dolgo traja dostava?</h2>
      <p className="mb-4">Standardna dostava je 2-5 dni. Personalizirane svece imajo rok 3-7 dni.</p>
      <h2 className="display-font text-3xl text-[var(--gold)]">Ali lahko vrnem izdelek?</h2>
      <p className="mb-4">Da, v 14 dneh za nerabljene izdelke v originalni embalazi.</p>
      <h2 className="display-font text-3xl text-[var(--gold)]">Kako aktiviram darilni bon?</h2>
      <p>Kodo iz emaila vpises v polje kupon v kosarici in kliknes Uporabi.</p>
    </StaticPage>
  );
}
