import type { Artwork } from 'types/artworks'
import Image from 'next/image'
import Link from 'next/link'
import DefaultImage from 'public/images/default.png'
import { useI18n } from 'libs/i18n'
import { getArtworkName } from 'utils/localization/artwork'

const Artworks = ({ artworks }: { artworks: Artwork[] }) => {
  const { locale } = useI18n()
  return (
    <div className="mb-10">
      <div className="grid gap-5 grid-cols-auto-fill-240 justify-center">
        {artworks.map((artwork) => {
          const { id, mainImage } = artwork
          const name = getArtworkName(artwork, locale)
          return (
            <Link href={`/artwork/${id}`} key={id}>
              <div className="w-60 my-2">
                <div className="text-4 font-bold mb-1 text-ellipsis whitespace-nowrap overflow-hidden h-7 max-w-60">
                  {name}
                </div>
                <div className="relative border-1 h-40 w-full overflow-hidden">
                  <Image
                    src={mainImage?.src || DefaultImage}
                    alt={name}
                    fill
                    className="object-cover transition-transform duration-300 scale-100 hover:scale-120"
                    sizes="auto"
                  />
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default Artworks
