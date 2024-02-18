import Image from 'next/image'
import Head from 'next/head'
import Layout from 'components/Layout'

const Admin = () => {
  return (
    <Layout>
      <Head>
        <title>First Post</title>
      </Head>
      <h1>Admin</h1>
      <p>This is the admin page</p>
      <Image src="/images/Pikachu.png" height={144} width={144} alt="Pikachu" />
    </Layout>
  )
}

export default Admin
