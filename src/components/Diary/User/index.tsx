import type { DiaryType } from 'types/diary'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { Button, Dialog } from '@ui'
import LoadingState from 'components/common/LoadingState'
import useGetDiary from './hooks/use-get-diary'
import Content from './components/Content'

const DiaryComponent = () => {
  const [diary, setDiary] = useState<DiaryType | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isImageDialogShowing, setIsImageDialogShowing] = useState(false)
  const { getDiary } = useGetDiary()
  const router = useRouter()
  const { id } = router.query

  const shouldShowDiary = diary && !isLoading
  const shouldShowImageDialog = diary && isImageDialogShowing

  const showImageDialog = () => {
    setIsImageDialogShowing(true)
  }

  const closeImageDialog = () => {
    setIsImageDialogShowing(false)
  }

  const fetchDiary = useCallback(
    async (id: string) => {
      setIsLoading(true)
      try {
        const data = await getDiary(id)
        console.log('diary data', data)
        if (!data) return
        setDiary(data)
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setIsLoading(false)
      }
    },
    [getDiary],
  )

  useEffect(() => {
    if (typeof id !== 'string') return
    fetchDiary(id)
  }, [fetchDiary, id])

  return (
    <div className="mb-20">
      {shouldShowDiary ? (
        <div className="my-5">
          <div className="font-bold mt-2 my-6 text-6">{diary.title}</div>
          <div className="relative border-1 h-80 w-full cursor-pointer sm:h-100" onClick={showImageDialog}>
            <Image
              src={diary.drawingImage.src}
              alt={diary.title}
              fill
              priority
              className="object-contain bg-white"
              sizes="auto"
            />
          </div>
          <Content content={diary.content} />
        </div>
      ) : (
        <LoadingState />
      )}
      <Button variant="plain" color="secondary" onClick={() => router.push('/diaries')}>
        Back to diaries
      </Button>
      {shouldShowImageDialog && (
        <Dialog title={diary.title} size="md" onClose={closeImageDialog}>
          <div className="relative h-full w-full">
            <Image
              src={diary.drawingImage.src}
              alt={diary.title}
              fill
              priority
              className="object-contain"
              sizes="auto"
            />
          </div>
        </Dialog>
      )}
    </div>
  )
}

export default DiaryComponent
