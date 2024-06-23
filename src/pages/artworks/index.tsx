import type { Artwork } from 'types/artworks'
import { readData } from 'utils/dataHandler/index'
import Layout from 'components/Layout'
import ArtworksComponent from 'components/Artworks'
import { DATA_BASE_NAMES } from 'constants/database'

export async function getServerSideProps() {
  try {
    const artworks = await readData<Artwork[]>(DATA_BASE_NAMES.ARTWORKS)
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

const ArtworksPage = ({ artworks }: { artworks: Artwork[] }) => {
  return (
    <Layout>
      <ArtworksComponent artworks={artworks} />
    </Layout>
  )
}

export default ArtworksPage
