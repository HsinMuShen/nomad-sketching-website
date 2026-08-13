import type { Artwork } from 'types/artworks'
import type { DiaryType } from 'types/diary'
import type { SketchMapItem } from 'types/location'
import Layout from 'components/Layout'
import RandomJourney from 'components/RandomJourney'
import { DATA_BASE_NAMES } from 'constants/database'
import { readData } from 'utils/dataHandler'
import { normalizeSketchMapItems } from 'utils/sketchMap'

export async function getServerSideProps({ query }: { query: { id?: string } }) {
  try {
    const [artworks, diaries] = await Promise.all([
      readData<Artwork>(DATA_BASE_NAMES.ARTWORKS),
      readData<DiaryType>(DATA_BASE_NAMES.DIARY),
    ])
    const items = normalizeSketchMapItems(artworks, diaries)
    return {
      props: {
        items,
        initialId: query.id || '',
      },
    }
  } catch (error) {
    console.error('Failed to fetch journey data:', error)
    return {
      props: { items: [], initialId: '' },
    }
  }
}

const JourneyPage = ({ items, initialId }: { items: SketchMapItem[]; initialId?: string }) => (
  <Layout>
    <RandomJourney items={items} initialId={initialId} />
  </Layout>
)

export default JourneyPage
