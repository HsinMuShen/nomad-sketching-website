import type { JSONContent } from '@tiptap/core'
import type { Locale } from 'libs/i18n/translations'
import type { Artwork } from 'types/artworks'

export const getArtworkName = (artwork: Pick<Artwork, 'name' | 'nameEn'>, locale: Locale) =>
  locale === 'en' && artwork.nameEn?.trim() ? artwork.nameEn : artwork.name

export const getArtworkContent = (artwork: Pick<Artwork, 'content' | 'contentEn'>, locale: Locale): JSONContent =>
  locale === 'en' && artwork.contentEn ? artwork.contentEn : artwork.content
