export type I18N_VALUE = {
  [key: string]: string | number;
};

export type I18N_ENUM = {
  vi: I18N_VALUE;
  en: I18N_VALUE;
  zh: I18N_VALUE;
};

/**
 * Enum Abstract Base Class
 */
export default class Enums {
  static _i18n: I18N_ENUM;

  /**
   * Get array list of static key in Enums
   */
  static getKeys(): string[] {
    return Object.keys(this).filter((val) => val.indexOf("_") !== 0);
  }

  /**
   * Find the enum's key from value
   */
  static findKey(value: string | number): string | undefined {
    return this.getKeys().find((k: string) => {
      const enumValue = this[k as keyof typeof Enums];
      return (
        (typeof enumValue === "string" || typeof enumValue === "number") &&
        enumValue === value
      );
    });
  }

  /**
   * Translate the enum's key
   */
  static translate(key: string | number, locale: string): string | undefined {
    const val = this._i18n?.[locale as keyof I18N_ENUM]?.[key];
    return typeof val === "string" ? val : undefined;
  }

  /**
   * Translate from value
   */
  static translateFromValue(
    value: string | number,
    locale: string
  ): string | number {
    const key = this.findKey(value);
    return key ? this.translate(key, locale) ?? "" : "";
  }

  /**
   * Find label (translate from value)
   */
  static findLabelKey(
    value: string | number,
    locale: string
  ): string | undefined {
    const key = this.findKey(value);
    return key ? this.translate(key, locale) : undefined;
  }
}
