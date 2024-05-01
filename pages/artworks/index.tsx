import type { Article } from 'components/admin/types'
import Image from 'next/image'
import { readData } from 'utils/dataHandler/index'
import Layout from 'components/Layout'
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
      {artworks.map((artwork) => (
        <div key={artwork.id}>
          <h2>{artwork.title}</h2>
          <Image
            src={artwork.coverImage || DefaultImage}
            alt={`Image of ${artwork.title}`}
            width={500}
            height={300}
            layout="responsive"
          />
        </div>
      ))}
    </Layout>
  )
}

export default Artworks
