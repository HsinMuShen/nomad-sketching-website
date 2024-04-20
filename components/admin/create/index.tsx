import type { MessageInputRef } from 'components/common/MessageInput/types'
import { useCallback, useRef } from 'react'
import Link from 'next/link'
import { Button, Input } from '@ui'
import MessageInput from 'components/common/MessageInput'
import useArticle from 'components/admin/hooks/use-article'

const CreateArticle = () => {
  const { title, setTitle, createArticle } = useArticle()
  const messageInputRef = useRef<MessageInputRef | null>(null)

  const onCreateArticle = useCallback(() => {
    const content = messageInputRef.current?.getContent()
    if (!content) return
    createArticle(content)
    setTitle('')
    messageInputRef.current?.clearContent()
  }, [createArticle, setTitle])

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Create Article</h1>
      <Input value={title} onValueChange={setTitle} />
      <MessageInput ref={messageInputRef} className="h-73" />
      <Button color="secondary" onClick={onCreateArticle}>
        Create
      </Button>
      <div>
        <Link href="/admin">Back to admin</Link>
      </div>
      <ul>
        <li>1. Create a new article</li>
        <li>2. Add content to the article</li>
        <li>3. Click the create button</li>
      </ul>
    </div>
  )
}

export default CreateArticle
