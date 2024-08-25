import type { DiaryType } from 'types/diary'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { readData } from 'utils/dataHandler'
import { Button } from 'components/common/ui'
import { DATA_BASE_NAMES } from 'constants/database'
import Diaries from './components/diaries'

const AdminDiaryComponent = () => {
  const [diaries, setDiaries] = useState<DiaryType[]>([])
  const router = useRouter()

  const onCreateClick = async () => {
    router.push('/admin/diary/create')
  }

  const onDiaryClick = async () => {
    router.push('/admin')
  }

  useEffect(() => {
    const fetchData = async () => {
      const diaries = await readData<DiaryType>(DATA_BASE_NAMES.DIARY)
      setDiaries(diaries)
    }
    fetchData()
  }, [])

  return (
    <div className="mb-10">
      <div className="flex justify-between items-center border-b-1 mb-4">
        <div className="text-5 font-bold">Artworks</div>
        <div>
          <Button className="mb-2 mr-2" color="secondary" variant="plain" onClick={onDiaryClick}>
            Admin
          </Button>
          <Button className="mb-2" color="secondary" variant="plain" onClick={onCreateClick}>
            Create Diary
          </Button>
        </div>
      </div>
      <Diaries diaries={diaries} />
    </div>
  )
}

export default AdminDiaryComponent
