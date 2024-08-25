import type { MessageInputRef } from 'components/common/MessageInput/types'
import { useRef } from 'react'
import { useRouter } from 'next/router'
import { Button } from 'components/common/ui'
import MessageInput from 'components/common/MessageInput'
import Drawing from 'components/Drawing'
import { getImageFileUrl } from 'utils/getImageFileUrl'
import TitleInput from './components/TitleInput'
import useDiary from './hooks/use-diary'

const DiaryCreateComponent: React.FC = () => {
  const router = useRouter()
  const messageInputRef = useRef<MessageInputRef | null>(null)
  const drawingRef = useRef<{ getImageFile: () => Promise<File | null> }>(null)
  const { diary, setDiary, onCreateDiary } = useDiary()
  const { title } = diary

  const updateTitle = (newTitle: string) => {
    setDiary({ ...diary, title: newTitle })
  }

  const createNewDiary = async () => {
    const content = messageInputRef.current?.getContent()
    const imageFile = await drawingRef.current?.getImageFile()
    if (!imageFile || !content) return

    const drawingImage = await getImageFileUrl(imageFile)
    setDiary({ ...diary, content, drawingImage })

    onCreateDiary(content, drawingImage)
    alert('Diary created!')
    router.push('/admin/diary')
  }

  const updateJsonString = (newJsonString: string) => {
    setDiary({ ...diary, drawingJsonString: newJsonString })
  }

  return (
    <div className="mb-10">
      <div className="flex flex-col gap-5 mb-5">
        <TitleInput title={title} setTitle={updateTitle} />
        <Drawing ref={drawingRef} updateJsonString={updateJsonString} />
        <MessageInput ref={messageInputRef} className="h-73" />
      </div>
      <Button variant="plain" color="secondary" onClick={createNewDiary}>
        Create
      </Button>
    </div>
  )
}

export default DiaryCreateComponent
