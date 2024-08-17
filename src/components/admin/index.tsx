import { useRouter } from 'next/router'
import { Button } from 'components/common/ui'
import Articles from './components/Articles'

const Admin = () => {
  const router = useRouter()

  const onCreateClick = async () => {
    router.push('/admin/create')
  }

  const onDiaryClick = async () => {
    router.push('/admin/diary')
  }

  return (
    <div>
      <div className="flex justify-between items-center border-b-1 mb-4">
        <div className="text-5 font-bold">Artworks</div>
        <div>
          <Button className="mb-2 mr-2" color="secondary" variant="plain" onClick={onDiaryClick}>
            Diary
          </Button>
          <Button className="mb-2" color="secondary" variant="plain" onClick={onCreateClick}>
            Create Artwork
          </Button>
        </div>
      </div>
      <Articles />
    </div>
  )
}

export default Admin
