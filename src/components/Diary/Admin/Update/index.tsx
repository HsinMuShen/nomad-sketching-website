import type { MessageInputRef } from 'components/common/MessageInput/types'
import { useRef, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Button } from 'components/common/ui'
import MessageInput from 'components/common/MessageInput'
import Drawing from 'components/Drawing'
import SketchMetadataFields from 'components/common/SketchMetadataFields'
import { useI18n } from 'libs/i18n'
import { getImageFileUrl } from 'utils/getImageFileUrl'
import TitleInput from './components/TitleInput'
import useDiary from './hooks/use-diary'

const DiaryUpdateComponent: React.FC = () => {
  const router = useRouter()
  const messageInputRef = useRef<MessageInputRef | null>(null)
  const drawingRef = useRef<{
    getImageFile: () => Promise<File | null>
    getCanvasJson: () => Promise<string | null>
  }>(null)
  const { diary, setDiary, fetchDiary, updateDiary, originJsonString } = useDiary()
  const { t } = useI18n()

  const updateTitle = (newTitle: string) => {
    setDiary({ ...diary, title: newTitle })
  }

  const onUpdateDiary = async () => {
    const content = messageInputRef.current?.getContent()
    const imageFile = await drawingRef.current?.getImageFile()
    const canvasJson = await drawingRef.current?.getCanvasJson()
    if (!imageFile || !content || !canvasJson) return

    const drawingImage = await getImageFileUrl(imageFile)
    const updatedDiary = {
      ...diary,
      content,
      drawingImage,
      drawingJsonString: canvasJson,
    }
    await updateDiary(updatedDiary)
    router.push('/admin/diary')
  }

  const onDiaryAdminPageClick = async () => {
    router.push('/admin/diary')
  }

  useEffect(() => {
    const { id } = router.query
    if (typeof id !== 'string') return
    fetchDiary(id)
  }, [fetchDiary, router])

  return (
    <div className="mb-10">
      <div className="flex flex-col gap-5 mb-5">
        <TitleInput title={diary.title} setTitle={updateTitle} />
        <Drawing ref={drawingRef} loadedJson={originJsonString} />
        <SketchMetadataFields value={diary} onChange={(metadata) => setDiary({ ...diary, ...metadata })} />
        <MessageInput ref={messageInputRef} className="h-73" content={diary.content} />
      </div>
      <Button variant="plain" color="secondary" onClick={onUpdateDiary} className="mr-3">
        {t('common.update')}
      </Button>
      <Button variant="plain" color="secondary" onClick={onDiaryAdminPageClick}>
        {t('admin.backToAdminDiary')}
      </Button>
    </div>
  )
}

export default DiaryUpdateComponent
