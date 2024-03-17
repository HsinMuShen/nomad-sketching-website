import type { Article } from 'components/admin/types'
import React, { useEffect } from 'react'
import Link from 'next/link'
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
      <Link href={`/admin/update/${article.id}`}>
        <div className="flex justify-between">
          <h2>{article.title}</h2>
          <p>{article.content}</p>
        </div>
      </Link>
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
