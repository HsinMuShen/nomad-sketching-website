import { getSortedPostsData } from 'src/libs/posts'
import Layout from 'src/components/Layout'

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
