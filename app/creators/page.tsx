import { CreatorCard } from "@/components/creator-card";
import { SectionHeading } from "@/components/section-heading";
import { getCreators } from "@/lib/catalog";
import { getDictionaryForLocale } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

export default async function CreatorsPage() {
  const locale = await getLocale();
  const dictionary = getDictionaryForLocale(locale);
  const creators = await getCreators();
  const spotlightCreators = creators.slice(0, 3);

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[1.8rem] border border-ink-100 bg-white">
        <div className="border-b border-ink-100 px-5 py-4 sm:px-6">
          <SectionHeading
            eyebrow={dictionary.creatorsPage.eyebrow}
            title={dictionary.creatorsPage.title}
            description={dictionary.creatorsPage.description}
          />
        </div>
        <div className="grid gap-4 px-5 py-5 sm:px-6 lg:grid-cols-3">
          {spotlightCreators.map((creator, index) => (
            <div
              key={creator.id}
              className={`rounded-[1.5rem] p-5 text-white ${
                index === 0
                  ? "bg-[linear-gradient(135deg,#4b50d0,#7d82ff)]"
                  : index === 1
                    ? "bg-[linear-gradient(135deg,#d4546c,#ff8f71)]"
                    : "bg-[linear-gradient(135deg,#1d8d7e,#63c6b3)]"
              }`}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/75">@{creator.githubLogin}</p>
              <h3 className="mt-3 font-display text-3xl">{creator.displayName}</h3>
              <p className="mt-3 text-sm leading-6 text-white/88">{creator.bio}</p>
            </div>
          ))}
        </div>
      </section>
      <div className="grid gap-5 lg:grid-cols-3">
        {creators.map((creator) => (
          <CreatorCard key={creator.id} creator={creator} locale={locale} />
        ))}
      </div>
    </div>
  );
}
