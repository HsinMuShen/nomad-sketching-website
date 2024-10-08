import type { DiaryType } from 'types/diary'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Button } from 'components/common/ui'
import { fetchDiaries } from 'components/Diaries/utils/fetch-diaries'
import Diaries from './components/diaries'

const AdminDiaryComponent = () => {
  const [diaries, setDiaries] = useState<DiaryType[]>([])
  const router = useRouter()

  const onCreateClick = async () => {
    router.push('/admin/diary/create')
  }

  const onAdminButtonClick = async () => {
    router.push('/admin')
  }

  const updateDiaries = async () => {
    const diaries = await fetchDiaries()
    setDiaries(diaries)
  }

  useEffect(() => {
    updateDiaries()
  }, [])

  return (
    <div className="mb-10">
      <div className="flex justify-between items-center border-b-1 mb-4">
        <div className="text-5 font-bold">Diaries</div>
        <div>
          <Button className="mb-2 mr-2" color="secondary" variant="plain" onClick={onAdminButtonClick}>
            Admin Page
          </Button>
          <Button className="mb-2" color="secondary" variant="plain" onClick={onCreateClick}>
            Create Diary
          </Button>
        </div>
      </div>
      <Diaries diaries={diaries} updateDiaries={updateDiaries} />
    </div>
  )
}

export default AdminDiaryComponent
