import Head from 'next/head'
import Layout from 'components/Layout'
import Update from 'components/admin/update'

export default function Post() {
  return (
    <Layout>
      <Head>
        <title>update</title>
      </Head>
      <Update />
    </Layout>
  )
}
