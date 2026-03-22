import { CollectionCard } from "@/components/collection-card";
import { SectionHeading } from "@/components/section-heading";
import { getCollections } from "@/lib/catalog";
import { getDictionaryForLocale } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

export default async function CollectionsPage() {
  const locale = await getLocale();
  const dictionary = getDictionaryForLocale(locale);
  const collections = await getCollections();
  const heroCollections = collections.slice(0, 2);

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[1.8rem] border border-ink-100 bg-white">
        <div className="border-b border-ink-100 px-5 py-4 sm:px-6">
          <SectionHeading
            eyebrow={dictionary.collectionsPage.eyebrow}
            title={dictionary.collectionsPage.title}
            description={dictionary.collectionsPage.description}
          />
        </div>
        <div className="grid gap-4 px-5 py-5 sm:px-6 lg:grid-cols-2">
          {heroCollections.map((collection, index) => (
            <div
              key={collection.id}
              className={`rounded-[1.6rem] p-6 text-white ${
                index === 0
                  ? "bg-[linear-gradient(135deg,#0f1d36,#294d8c)]"
                  : "bg-[linear-gradient(135deg,#8f1433,#d03b4c)]"
              }`}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/75">{dictionary.cards.editorialCollection}</p>
              <h3 className="mt-3 font-display text-3xl">{collection.title}</h3>
              <p className="mt-3 text-sm leading-6 text-white/88">{collection.description}</p>
            </div>
          ))}
        </div>
      </section>
      <div className="grid gap-5 lg:grid-cols-3">
        {collections.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} locale={locale} />
        ))}
      </div>
    </div>
  );
}
