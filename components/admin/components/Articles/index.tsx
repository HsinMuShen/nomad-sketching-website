import type { Article } from 'components/admin/types'
import React from 'react'
import { useEffect } from 'react'
import useArticles from 'components/admin/hooks/use-articles'

type ArticleProps = {
  article: Article
  removeArticle: (id: string) => void
}

const Article = ({ article, removeArticle }: ArticleProps) => {
  const onDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    removeArticle(article.id)
  }

  return (
    <div className="mt-2">
      <h2>{article.title}</h2>
      <p>{article.content}</p>
      <button
        className="mt-1 border-black-solid border-1 cursor-pointer"
        onClick={onDeleteClick}
      >
        delete
      </button>
    </div>
  )
}

const Articles = () => {
  const { articles, fetchArticles, removeArticle } = useArticles()

  useEffect(() => {
    fetchArticles()
  }, [fetchArticles])

  return (
    <div>
      {articles.map((article) => (
        <Article
          key={article.id}
          article={article}
          removeArticle={removeArticle}
        />
      ))}
    </div>
  )
}

export default Articles
