import { useCallback } from 'react'
import Link from 'next/link'
import { Button, ImageUploadButton } from '@ui'
import useArticle from 'components/admin/hooks/use-article'
import { uploadAttachment } from 'utils/attachment'

const CreateArticle = () => {
  const { article, setArticle, createArticle } = useArticle()

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

  const onCreateArticle = useCallback(() => {
    createArticle()
    setArticle({ title: '', content: '' })
  }, [createArticle, setArticle])

  const onInput = async (file: File) => {
    const downloadURL = await uploadAttachment(file)
    console.log('downloadURL', downloadURL)
  }
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
      <Button color="secondary" onClick={onCreateArticle}>
        Create
      </Button>
      <ImageUploadButton onUpload={onInput} />
      <div>
        <Link href="/admin">Back to admin</Link>
      </div>
    </div>
  )
}

export default CreateArticle
