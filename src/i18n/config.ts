export const locales = ["zh-tw", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "zh-tw";

export const isLocale = (value: string): value is Locale => (locales as readonly string[]).includes(value);

/** BCP 47 tag used for <html lang> and hreflang. */
export const htmlLang: Record<Locale, string> = {
  "zh-tw": "zh-TW",
  en: "en",
};

export const localeLabel: Record<Locale, string> = {
  "zh-tw": "中文",
  en: "English",
};

/** Open Graph locale codes. */
export const ogLocale: Record<Locale, string> = {
  "zh-tw": "zh_TW",
  en: "en_US",
};
