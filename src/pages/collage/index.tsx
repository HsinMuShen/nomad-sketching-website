import Head from 'next/head'
import Header from 'components/Layout/components/Header'
import CollageEditor from 'components/CollageEditor'
import type { Artwork } from 'types/artworks'
import { readData } from 'utils/dataHandler/index'
import { DATA_BASE_NAMES } from 'constants/database'

export async function getServerSideProps() {
  try {
    const artworks = await readData<Artwork[]>(DATA_BASE_NAMES.ARTWORKS)
    return { props: { artworks } }
  } catch (error) {
    console.error('Failed to fetch collage artwork library:', error)
    return { props: { artworks: [] } }
  }
}

const CollagePage = ({ artworks }: { artworks: Artwork[] }) => {
  return (
    <>
      <Head>
        <title>Collage Studio · Nomad Sketching</title>
        <meta name="description" content="Upload, crop, arrange and export image collages directly in your browser." />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <Header />
      <main className="pt-15">
        <CollageEditor artworks={artworks} />
      </main>
    </>
  )
}

export default CollagePage
