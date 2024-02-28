import Head from 'next/head'
import Layout from 'components/Layout'
import CreateComponent from 'components/admin/create'

const AdminCreate = () => {
  return (
    <Layout>
      <Head>
        <title>Create Article</title>
      </Head>
      <CreateComponent />
    </Layout>
  )
}

export default AdminCreate
