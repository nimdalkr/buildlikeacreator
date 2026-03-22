import { SectionHeading } from "@/components/section-heading";
import { getDictionaryForLocale } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

export default async function AboutPage() {
  const locale = await getLocale();
  const dictionary = getDictionaryForLocale(locale);

  return (
    <div className="mx-auto max-w-4xl">
      <section className="surface rounded-[2rem] p-8 sm:p-10">
        <SectionHeading
          eyebrow={dictionary.aboutPage.eyebrow}
          title={dictionary.aboutPage.title}
          description={dictionary.aboutPage.description}
        />
        <div className="prose-muted mt-8 space-y-4 text-base leading-8">
          <p>{dictionary.aboutPage.paragraph1}</p>
          <p>{dictionary.aboutPage.paragraph2}</p>
        </div>
      </section>
    </div>
  );
}
