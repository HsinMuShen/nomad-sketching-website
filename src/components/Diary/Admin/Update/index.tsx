import type { MessageInputRef } from 'components/common/MessageInput/types'
import { useRef, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Button } from 'components/common/ui'
import MessageInput from 'components/common/MessageInput'
import Drawing from 'components/Drawing'
import TitleInput from './components/TitleInput'
import useDiary from './hooks/use-diary'

const DiaryUpdateComponent: React.FC = () => {
  const router = useRouter()
  const messageInputRef = useRef<MessageInputRef | null>(null)
  const drawingRef = useRef<{ getImageFile: () => Promise<File | null> }>(null)
  const { diary, setDiary, fetchDiary, updateDiary } = useDiary()

  const updateTitle = (newTitle: string) => {
    setDiary({ ...diary, title: newTitle })
  }

  const updateJsonString = (newJsonString: string) => {
    setDiary({ ...diary, drawingJsonString: newJsonString })
  }

  const onUpdateDiary = async () => {
    const content = messageInputRef.current?.getContent()
    if (!content) return
    const imageFile = await drawingRef.current?.getImageFile()
    if (!imageFile) return
    await updateDiary()
    router.push('/admin/diary')
  }

  useEffect(() => {
    const { id } = router.query
    console.log('id', id)
    if (typeof id !== 'string') return
    fetchDiary(id)
  }, [fetchDiary, router])

  return (
    <div className="mb-10">
      <div className="flex flex-col gap-5 mb-5">
        <TitleInput title={diary.title} setTitle={updateTitle} />
        <Drawing ref={drawingRef} updateJsonString={updateJsonString} loadedJson={diary.drawingJsonString} />
        <MessageInput ref={messageInputRef} className="h-73" content={diary.content} />
      </div>
      <Button variant="plain" color="secondary" onClick={onUpdateDiary}>
        Create
      </Button>
    </div>
  )
}

export default DiaryUpdateComponent
