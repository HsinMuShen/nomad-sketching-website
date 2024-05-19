import { readData } from 'src/utils/dataHandler/index'
import Image from 'next/image'
import Link from 'next/link'
import Layout from 'src/components/Layout'
import aboutImage from 'public/images/michael.png'

type AboutItem = {
  title: string
  contents: { content: string }[]
  otherInfo: {
    title: string
    links: { name: string; url: string }[]
  }
}

export async function getServerSideProps() {
  try {
    const items = await readData<AboutItem>('about')
    const item = items[0]
    return {
      props: { item },
    }
  } catch (error) {
    console.error('Failed to fetch data:', error)
    return {
      props: { item: { title: '', content: '' } },
    }
  }
}

const About = ({ item }: { item: AboutItem }) => {
  return (
    <Layout>
      <div className="flex flex-col">
        <div className="text-4 font-bold mt-5">{item.title}</div>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-around w-full">
          <div className="relative h-90 w-40">
            <Image src={aboutImage} alt={item.title} fill className="object-cover" sizes="auto" />
          </div>
          <div className="flex flex-col mb-2">
            {item.contents.map(({ content }) => (
              <div key={content} className="max-w-80 break-words mb-2 text-sm">
                {content}
              </div>
            ))}
          </div>
        </div>
        <div className="text-4 font-bold mt-8 mb-5">{item.otherInfo.title}</div>
        <div className="flex flex-col mb-2">
          {item.otherInfo.links.map(({ name, url }) => (
            <div key={name} className="mb-2 text-sm underline font-bold">
              <Link href={url}>{name}</Link>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}

export default About
