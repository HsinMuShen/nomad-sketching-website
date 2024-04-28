import { getSortedPostsData } from 'libs/posts'
import Layout from 'components/Layout'

export async function getStaticProps() {
  const allPostsData = getSortedPostsData()
  return {
    props: {
      allPostsData,
    },
  }
}

export default function Home() {
  return <Layout> {'home page'} </Layout>
}
