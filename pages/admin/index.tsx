import Head from 'next/head'
import Layout from 'components/Layout'
import AdminComponent from 'components/admin'

const Admin = () => {
  return (
    <Layout>
      <Head>
        <title>First Post</title>
      </Head>
      <AdminComponent />
    </Layout>
  )
}

export default Admin
