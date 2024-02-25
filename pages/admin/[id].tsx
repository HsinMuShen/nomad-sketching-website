import Head from 'next/head'
import Layout from 'components/Layout'
import { getAllPostIds, getPostData } from '../../libs/posts'

export async function getStaticPaths() {
  const paths = getAllPostIds()
  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  const postData = getPostData(params.id)
  return {
    props: {
      postData,
    },
  }
}

export default function Post({
  postData,
}: {
  postData: { title: string; id: string; date: string }
}) {
  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      {postData.title}
      <br />
      {postData.id}
      <br />
      {postData.date}
    </Layout>
  )
}
