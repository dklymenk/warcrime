import * as Localization from "expo-localization"
import i18n from "i18n-js"
import ru from "./ru.json"
import uk from "./uk.json"

i18n.fallbacks = true
i18n.translations = { ru, uk }
i18n.defaultLocale = "uk"

i18n.locale = Localization.locale || i18n.defaultLocale

/**
 * Builds up valid keypaths for translations.
 * Update to your default locale of choice if not English.
 */
type DefaultLocale = typeof uk
export type TxKeyPath = RecursiveKeyOf<DefaultLocale>

type RecursiveKeyOf<TObj extends Record<string, any>> = {
  [TKey in keyof TObj & string]: TObj[TKey] extends Record<string, any>
    ? `${TKey}` | `${TKey}.${RecursiveKeyOf<TObj[TKey]>}`
    : `${TKey}`
}[keyof TObj & string]
