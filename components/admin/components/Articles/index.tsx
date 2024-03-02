import type { Article } from 'components/admin/types'
import { useEffect } from 'react'
import useArticles from './hooks/use-articles'

const Article = ({ article }: { article: Article }) => {
  return (
    <div>
      <h2>{article.title}</h2>
      <p>{article.content}</p>
    </div>
  )
}

const Articles = () => {
  const { articles, fetchArticles } = useArticles()

  useEffect(() => {
    fetchArticles()
  }, [fetchArticles])

  return (
    <div>
      {articles.map((article) => (
        <Article key={article.id} article={article} />
      ))}
    </div>
  )
}

export default Articles
