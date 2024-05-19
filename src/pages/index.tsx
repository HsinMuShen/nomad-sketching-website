import { readData } from 'src/utils/dataHandler/index'
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
  return (
    <Layout>
      <Artworks images={artworks} />
    </Layout>
  )
}
