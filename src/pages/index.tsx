import type { GetServerSideProps } from 'next'
import fs from 'fs'
import path from 'path'
import Layout from 'components/Layout'
import Artworks from 'components/Artworks'

export const getServerSideProps: GetServerSideProps = async () => {
  const imagesDirectory = path.join(process.cwd(), 'public', 'images', 'artworks')
  const files: string[] = fs.readdirSync(imagesDirectory)
  const imageFiles = files.filter((file) => /\.(jpg|jpeg|png|gif)$/.test(file))
  const images = imageFiles.map((file) => `/images/artworks/${file}`)

  return {
    props: {
      images,
    },
  }
}

export default function Home({ images }: { images: string[] }) {
  return (
    <Layout>
      <Artworks images={images} />
    </Layout>
  )
}
