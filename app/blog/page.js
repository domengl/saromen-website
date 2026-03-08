import StaticPage from "@/components/static-page";

export default function BlogPage() {
  return (
    <StaticPage title="Blog" subtitle="Nasveti o vonjih, atmosferi in negi svec.">
      <article className="mb-6">
        <h2 className="display-font text-3xl text-[var(--gold)]">Luxury ambient doma</h2>
        <p>Kombinacija tople svetlobe, amber tona in ciste postavitve doda prostoru premium obcutek.</p>
      </article>
      <article className="mb-6">
        <h2 className="display-font text-3xl text-[var(--gold)]">Vodnik po vonjih</h2>
        <p>Za dnevni ambient priporocamo white tea profile, za vecerni ritual pa musk, amber in oud.</p>
      </article>
      <article>
        <h2 className="display-font text-3xl text-[var(--gold)]">Personalizirana darila</h2>
        <p>Izberi tip svece, dodaj napis ali logo in sestavi darilo za poroko, rojstni dan ali business paket.</p>
      </article>
    </StaticPage>
  );
}
