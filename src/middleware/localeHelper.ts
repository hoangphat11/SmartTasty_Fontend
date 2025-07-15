export const supportedLocales = ["vi", "en", "zh"] as const;

export type AppLocale = (typeof supportedLocales)[number];

export const defaultLocale: AppLocale = "vi";

export function getSupportedLocales(): AppLocale[] {
  return [...supportedLocales];
}
