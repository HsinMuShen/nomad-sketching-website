import { readData } from 'src/utils/dataHandler/index'
import Layout from 'src/components/Layout'

type Item = {
  id: string
  content: string
}

export async function getServerSideProps() {
  try {
    const items = await readData<Item>('specialThanks')
    return {
      props: { items },
    }
  } catch (error) {
    console.error('Failed to fetch data:', error)
    return {
      props: { items: [] },
    }
  }
}

const SpecialThanks = ({ items }: { items: Item[] }) => {
  return (
    <Layout>
      <>
        <div className="text-4 font-bold pt-5">致謝</div>
        <div className="my-8 flex flex-col items-center mx-auto w-full sm:w-60vw">
          {items.map(({ content, id }) => (
            <div className="w-full break-words mb-2 text-sm mr-auto" key={id}>
              {content}
            </div>
          ))}
        </div>
      </>
    </Layout>
  )
}

export default SpecialThanks
