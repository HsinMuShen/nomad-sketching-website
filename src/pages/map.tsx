import type { Artwork } from 'types/artworks'
import type { DiaryType } from 'types/diary'
import type { SketchMapItem } from 'types/location'
import Layout from 'components/Layout'
import SketchMap from 'components/SketchMap'
import { DATA_BASE_NAMES } from 'constants/database'
import { readData } from 'utils/dataHandler'
import { normalizeSketchMapItems } from 'utils/sketchMap'

export async function getServerSideProps() {
  try {
    const [artworks, diaries] = await Promise.all([
      readData<Artwork>(DATA_BASE_NAMES.ARTWORKS),
      readData<DiaryType>(DATA_BASE_NAMES.DIARY),
    ])
    const items = normalizeSketchMapItems(artworks, diaries)
    return {
      props: {
        items,
      },
    }
  } catch (error) {
    console.error('Failed to fetch map data:', error)
    return {
      props: { items: [] },
    }
  }
}

const MapPage = ({ items }: { items: SketchMapItem[] }) => (
  <Layout>
    <SketchMap items={items} />
  </Layout>
)

export default MapPage
