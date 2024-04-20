import type { MessageInputRef } from 'components/common/MessageInput/types'
import { useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Input } from '@ui'
import useArticle from 'components/admin/hooks/use-article'
import MessageInput from 'components/common/MessageInput'

const Update = () => {
  const messageInputRef = useRef<MessageInputRef | null>(null)
  const router = useRouter()
  const { id } = router.query
  const { title, setTitle, content, fetchArticle, updateArticle } = useArticle()

  const onUpdateArticle = useCallback(() => {
    const content = messageInputRef.current?.getContent()
    if (!content) return
    if (typeof id !== 'string') return
    updateArticle(id, content)
  }, [updateArticle, id])

  useEffect(() => {
    if (typeof id !== 'string') return
    fetchArticle(id)
  }, [fetchArticle, id])

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Create Article</h1>
      <Input value={title} onValueChange={setTitle} />
      <MessageInput ref={messageInputRef} content={content} />
      <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600" onClick={onUpdateArticle}>
        Update
      </button>
      <div>
        <Link href="/admin">Back to admin</Link>
      </div>
    </div>
  )
}

export default Update
