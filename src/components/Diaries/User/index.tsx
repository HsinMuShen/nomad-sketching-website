import type { DiaryType } from 'types/diary'
import { useState, useEffect } from 'react'
import LoadingState from 'components/common/LoadingState'
import Diaries from './components/diaries'
import { fetchDiaries } from 'components/Diaries/utils/fetch-diaries'

const UserDiaryComponent = () => {
  const [diaries, setDiaries] = useState<DiaryType[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const updateDiaries = async () => {
    setIsLoading(true)
    const diaries = await fetchDiaries()
    setDiaries(diaries)
    setIsLoading(false)
  }

  useEffect(() => {
    updateDiaries()
  }, [])

  return <div className="mb-10">{isLoading ? <LoadingState /> : <Diaries diaries={diaries} />}</div>
}

export default UserDiaryComponent
