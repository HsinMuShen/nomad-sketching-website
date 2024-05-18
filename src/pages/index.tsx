import type { GetStaticProps } from 'next'
import { readData } from 'src/utils/dataHandler/index'
import Layout from 'components/Layout'
import Artworks from 'components/Artworks'

type Artworks = {
  url: string
  name: string
}

export const getServerSideProps: GetStaticProps = async () => {
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
