import { useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import useArticle from 'components/admin/hooks/use-article'

const Update = () => {
  const router = useRouter()
  const { id } = router.query
  const { article, setArticle, fetchArticle, updateArticle } = useArticle()

  const onArticleChange = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      name: string,
    ) => {
      const { value } = e.target
      setArticle((prevArticle) => ({
        ...prevArticle,
        [name]: value,
      }))
    },
    [setArticle],
  )

  const onUpdateArticle = useCallback(() => {
    if (typeof id !== 'string') return
    updateArticle(id)
  }, [updateArticle, id])

  useEffect(() => {
    if (typeof id !== 'string') return
    fetchArticle(id)
  }, [fetchArticle, id])

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Create Article</h1>
      <input
        className="border border-gray-300 rounded-md px-3 py-2 mb-2 block w-full"
        type="text"
        value={article.title}
        onChange={(e) => onArticleChange(e, 'title')}
      />
      <textarea
        className="border border-gray-300 rounded-md px-3 py-2 mb-2 block w-full"
        value={article.content}
        onChange={(e) => onArticleChange(e, 'content')}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        onClick={onUpdateArticle}
      >
        Update
      </button>
      <div>
        <Link href="/admin">Back to admin</Link>
      </div>
    </div>
  )
}

export default Update
