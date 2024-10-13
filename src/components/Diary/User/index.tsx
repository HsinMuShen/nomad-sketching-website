import type { DiaryType } from 'types/diary'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { Button, Dialog } from 'components/common/ui'
import useGetDiary from './hooks/use-get-diary'
import Content from './components/Content'

const DiaryComponent = () => {
  const [diary, setDiary] = useState<DiaryType | null>(null)
  const [isImageDialogShowing, setIsImageDialogShowing] = useState(false)
  const { getDiary } = useGetDiary()
  const router = useRouter()
  const { id } = router.query

  const shouldShowImageDialog = diary && isImageDialogShowing

  const showImageDialog = () => {
    setIsImageDialogShowing(true)
  }

  const closeImageDialog = () => {
    setIsImageDialogShowing(false)
  }

  const fetchDiary = useCallback(
    async (id: string) => {
      const data = await getDiary(id)
      console.log('diary data', data)

      if (!data) return
      setDiary(data)
    },
    [getDiary],
  )

  useEffect(() => {
    if (typeof id !== 'string') return
    fetchDiary(id)
  }, [fetchDiary, id])

  return (
    <div className="mb-20">
      {diary && (
        <div className="my-5">
          <div className="font-bold mt-2 my-6 text-6">{diary.title}</div>
          <div className="relative border-1 h-80 w-full cursor-pointer" onClick={showImageDialog}>
            <Image src={diary.drawingImage.src} alt={diary.title} fill priority className="object-cover" sizes="auto" />
          </div>
          <Content content={diary.content} />
        </div>
      )}
      <Button variant="plain" color="secondary" onClick={() => router.push('/diaries')}>
        Back to diaries
      </Button>
      {shouldShowImageDialog && (
        <Dialog title={diary.title} size="lg" onClose={closeImageDialog}>
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
