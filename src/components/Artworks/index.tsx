import type { Artwork } from 'types/artworks'
import Image from 'next/image'
import Link from 'next/link'
import DefaultImage from 'public/images/default.png'

const Artworks = ({ artworks }: { artworks: Artwork[] }) => {
  return (
    <div className="mb-10">
      <div className="grid gap-5 grid-cols-auto-fill-240 justify-center">
        {artworks.map(({ name, id, mainImageUrl }) => (
          <Link href={`/artwork/${id}`} key={id}>
            <div className="w-60 my-2">
              <div className="text-4 font-bold mb-1">{name}</div>
              <div className="relative border-1 h-40 w-full">
                <Image src={mainImageUrl || DefaultImage} alt={name} fill className="object-cover" sizes="auto" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Artworks
