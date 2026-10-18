import { fr } from './fr.js';
import { ar } from './ar.js';
import { en } from './en.js';
import { SupportedLanguage, TranslationSchema } from '../types/i18n.types.js';

export const dictionaries: Record<SupportedLanguage, TranslationSchema> = {
  fr,
  ar,
  en,
};

type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

export type TranslationKey = NestedKeyOf<TranslationSchema>;

export function t(
  key: TranslationKey,
  lang: SupportedLanguage = 'fr',
  params?: Record<string, string | number>
): string {
  const dict = dictionaries[lang] || dictionaries.fr;
  const parts = key.split('.');

  let current: unknown = dict;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return key;
    }
  }

  let text = typeof current === 'string' ? current : key;
  if (params) {
    for (const [pKey, pVal] of Object.entries(params)) {
      text = text.replace(new RegExp(`{${pKey}}`, 'g'), String(pVal));
    }
  }

  return text;
}
