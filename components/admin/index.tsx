import { useCallback } from 'react'
import useArticle from './hooks/use-article'

const Admin = () => {
  const { article, setArticle, createArticle } = useArticle()

  const onArticleChange = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      name: string
    ) => {
      console.log('e', e.target.name, e.target.value)
      const { value } = e.target
      setArticle(prevArticle => ({
        ...prevArticle,
        [name]: value,
      }))
    },
    [setArticle]
  )

  const onCreateArticle = useCallback(() => {
    createArticle()
    setArticle({ title: '', content: '' })
  }, [createArticle])

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Create Article</h1>
      <input
        className="border border-gray-300 rounded-md px-3 py-2 mb-2 block w-full"
        type="text"
        value={article.title}
        onChange={e => onArticleChange(e, 'title')}
      />
      <textarea
        className="border border-gray-300 rounded-md px-3 py-2 mb-2 block w-full"
        value={article.content}
        onChange={e => onArticleChange(e, 'content')}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        onClick={onCreateArticle}
      >
        Create
      </button>
    </div>
  )
}

export default Admin
