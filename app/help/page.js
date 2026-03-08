import StaticPage from "@/components/static-page";

export default function HelpPage() {
  return (
    <StaticPage title="Help & Support" subtitle="Pomoc pri nakupu, vracilih in darilnih bonih.">
      <p>Za hitra vprasanja pisi na support@saromen.com.</p>
      <p>Za business sodelovanja pisi na hello@saromen.com.</p>
      <p>Odgovorimo praviloma v 24 urah.</p>
      <p>
        Politike: <a href="/policy/privacy" className="text-[var(--gold)]">Privacy</a>,{" "}
        <a href="/policy/terms" className="text-[var(--gold)]">Terms</a>,{" "}
        <a href="/policy/shipping" className="text-[var(--gold)]">Shipping</a>.
      </p>
    </StaticPage>
  );
}
