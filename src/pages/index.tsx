import { getSortedPostsData } from 'libs/posts'
import Layout from 'components/Layout'
import Artworks from 'components/Artworks'

export async function getStaticProps() {
  const allPostsData = getSortedPostsData()
  return {
    props: {
      allPostsData,
    },
  }
}

export default function Home() {
  return (
    <Layout>
      <Artworks
        imageData={[
          'https://www.letsbuildui.dev/content/images/size/w2000/2024/03/main.jpg',
          'https://images.unsplash.com/photo-1699479427031-c811674d2a93?q=80&w=2744&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          'https://www.letsbuildui.dev/content/images/size/w2000/2024/03/main.jpg',
          'https://png.pngtree.com/thumb_back/fh260/background/20210907/pngtree-beautiful-and-fresh-anime-scene-image_811416.jpg',
          'https://images.unsplash.com/photo-1699479427031-c811674d2a93?q=80&w=2744&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          'https://png.pngtree.com/thumb_back/fh260/background/20210907/pngtree-beautiful-and-fresh-anime-scene-image_811416.jpg',
          'https://www.letsbuildui.dev/content/images/size/w2000/2024/03/main.jpg',
          'https://images.unsplash.com/photo-1699479427031-c811674d2a93?q=80&w=2744&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          'https://www.letsbuildui.dev/content/images/size/w2000/2024/03/main.jpg',
          'https://png.pngtree.com/thumb_back/fh260/background/20210907/pngtree-beautiful-and-fresh-anime-scene-image_811416.jpg',
          'https://images.unsplash.com/photo-1699479427031-c811674d2a93?q=80&w=2744&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          'https://png.pngtree.com/thumb_back/fh260/background/20210907/pngtree-beautiful-and-fresh-anime-scene-image_811416.jpg',
          'https://www.letsbuildui.dev/content/images/size/w2000/2024/03/main.jpg',
          'https://images.unsplash.com/photo-1699479427031-c811674d2a93?q=80&w=2744&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          'https://www.letsbuildui.dev/content/images/size/w2000/2024/03/main.jpg',
          'https://png.pngtree.com/thumb_back/fh260/background/20210907/pngtree-beautiful-and-fresh-anime-scene-image_811416.jpg',
          'https://images.unsplash.com/photo-1699479427031-c811674d2a93?q=80&w=2744&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          'https://png.pngtree.com/thumb_back/fh260/background/20210907/pngtree-beautiful-and-fresh-anime-scene-image_811416.jpg',
        ]}
      />
    </Layout>
  )
}
