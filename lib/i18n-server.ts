import type { Locale } from "@/lib/i18n";

export async function getLocale(): Promise<Locale> {
  return "en";
}

export async function setLocale(_: Locale) {
  return;
}
