import type { Article } from 'src/components/admin/types'
import Image from 'next/image'
import { readData } from 'src/utils/dataHandler/index'
import Layout from 'src/components/Layout'
import DefaultImage from 'public/images/default.png'

export async function getServerSideProps() {
  try {
    const artworks = await readData<Article[]>('articles')
    return {
      props: { artworks },
    }
  } catch (error) {
    console.error('Failed to fetch data:', error)
    return {
      props: { artworks: [] },
    }
  }
}

const Artworks = ({ artworks }: { artworks: Article[] }) => {
  return (
    <Layout>
      <div className="grid gap-3 grid-cols-auto-fill-240 justify-center">
        {artworks.map((artwork) => (
          <div key={artwork.id} className="w-60">
            <div className="text-4 font-bold">{artwork.title}</div>
            <div className="relative border-1 h-40 w-full">
              <Image
                src={artwork.coverImage?.src || DefaultImage}
                alt={artwork.title}
                fill
                className="object-cover"
                sizes="auto"
              />
            </div>
          </div>
        ))}
      </div>
    </Layout>
  )
}

export default Artworks
