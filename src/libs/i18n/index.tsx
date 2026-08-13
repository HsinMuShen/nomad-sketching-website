import type { Locale } from './translations'
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react'
import { translations } from './translations'

type I18nContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  toggleLocale: () => void
  t: (key: string) => string
}

const DEFAULT_LOCALE: Locale = 'zh'
const STORAGE_KEY = 'nomad-sketching-locale'

const I18nContext = createContext<I18nContextValue | null>(null)

const isLocale = (value: string | null): value is Locale => value === 'zh' || value === 'en'

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE)

  const setLocale = (nextLocale: Locale) => {
    setLocaleState(nextLocale)
    if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, nextLocale)
  }

  const toggleLocale = () => {
    setLocale(locale === 'zh' ? 'en' : 'zh')
  }

  useEffect(() => {
    const storedLocale = localStorage.getItem(STORAGE_KEY)
    if (isLocale(storedLocale)) setLocaleState(storedLocale)
  }, [])

  useEffect(() => {
    document.documentElement.lang = locale === 'zh' ? 'zh-Hant' : 'en'
  }, [locale])

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      toggleLocale,
      t: (key: string) =>
        translations[locale][key as keyof (typeof translations)[typeof locale]] ||
        translations.en[key as keyof typeof translations.en] ||
        key,
    }),
    [locale],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export const useI18n = () => {
  const context = useContext(I18nContext)
  if (!context) throw new Error('useI18n must be used within I18nProvider')
  return context
}
