import type { SketchMapItem } from 'types/location'
import Image from 'next/image'
import Link from 'next/link'
import { useI18n } from 'libs/i18n'
import DefaultImage from 'public/images/default.png'

type MapMarkerPopupProps = {
  item: SketchMapItem
}

const getPlaceLine = (item: SketchMapItem) => [item.city, item.country].filter(Boolean).join(', ')

const MapMarkerPopup = ({ item }: MapMarkerPopupProps) => {
  const { t } = useI18n()

  return (
    <div className="w-full overflow-hidden rounded-2 border border-neutral-200 bg-white shadow-dialog">
      <div className="relative h-44 w-full bg-neutral-100">
        <Image src={item.imageUrl || DefaultImage} alt={item.title} fill className="object-cover" sizes="320px" />
      </div>
      <div className="p-4">
        <div className="mb-1 text-xs uppercase tracking-0.2em text-gray-500">{item.type}</div>
        <h3 className="mb-2 text-5 font-bold leading-snug">{item.title}</h3>
        {item.placeName && <div className="text-sm font-bold text-gray-700">{item.placeName}</div>}
        {getPlaceLine(item) && <div className="text-sm text-gray-500">{getPlaceLine(item)}</div>}
        {item.locationNote && (
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-gray-600">{item.locationNote}</p>
        )}
        <Link
          href={item.detailUrl}
          className="mt-4 inline-flex border-b border-black pb-0.5 text-sm font-bold text-black hover:text-gray-600"
        >
          {t('common.viewStory')}
        </Link>
      </div>
    </div>
  )
}

export default MapMarkerPopup
