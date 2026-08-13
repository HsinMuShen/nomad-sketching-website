import { useEffect } from 'react'
import { logEvent } from 'libs/event-logger'
import { readData } from 'src/utils/dataHandler/index'
import Layout from 'src/components/Layout'
import { useI18n } from 'libs/i18n'

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
  const { t } = useI18n()

  useEffect(() => {
    logEvent('special_thanks_page_view')
  }, [])

  return (
    <Layout>
      <>
        <div className="text-4 font-bold pt-5">{t('specialThanks.title')}</div>
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
