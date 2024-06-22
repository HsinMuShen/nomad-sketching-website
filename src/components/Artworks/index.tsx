import type { Artwork } from 'types/artworks'
import Image from 'next/image'
import DefaultImage from 'public/images/default.png'

const Artworks = ({ artworks }: { artworks: Artwork[] }) => {
  return (
    <div className="grid gap-3 grid-cols-auto-fill-240 justify-center">
      {artworks.map(({ name, id, mainImageUrl }) => (
        <div key={id} className="w-60">
          <div className="text-4 font-bold">{name}</div>
          <div className="relative border-1 h-40 w-full">
            <Image src={mainImageUrl || DefaultImage} alt={name} fill className="object-cover" sizes="auto" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default Artworks
