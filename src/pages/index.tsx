import { useEffect } from 'react'
import { logEvent } from 'libs/event-logger'
import { readData } from 'utils/dataHandler/index'
import Layout from 'components/Layout'
import Artworks from 'components/Artworks'

type Artworks = {
  id: string
  url: string
  name: string
}

export async function getStaticProps() {
  try {
    const artworks = await readData<Artworks[]>('artworks')
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

export default function Home({ artworks }: { artworks: Artworks[] }) {
  useEffect(() => {
    logEvent('index_page_view')
  }, [])

  return (
    <Layout>
      <Artworks images={artworks} />
    </Layout>
  )
}
