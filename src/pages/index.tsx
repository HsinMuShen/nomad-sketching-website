import type { Artwork } from 'types/artworks'
import { useEffect } from 'react'
import { logEvent } from 'libs/event-logger'
import { readData } from 'utils/dataHandler/index'
import Layout from 'components/Layout'
import CarouselArtworks from 'components/CarouselArtworks'

export async function getStaticProps() {
  try {
    const artworks = await readData<Artwork[]>('artworks')
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

export default function Home({ artworks }: { artworks: Artwork[] }) {
  useEffect(() => {
    logEvent('index_page_view')
  }, [])

  return (
    <Layout>
      <CarouselArtworks images={artworks} />
    </Layout>
  )
}
