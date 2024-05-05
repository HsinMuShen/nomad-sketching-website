import type { Article } from 'components/admin/types'
import React, { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from 'components/common/ui'
import DefaultImage from 'public/images/default.png'
import useArticles from 'components/admin/hooks/use-articles'

type ArticleProps = {
  article: Article
  removeArticle: (id: string) => void
}

const Article = ({ article, removeArticle }: ArticleProps) => {
  const onDeleteClick = () => {
    removeArticle(article.id)
  }

  return (
    <div className="w-60 h-auto">
      <Link href={`/admin/update/${article.id}`}>
        <div className="flex justify-between items-center mb-1">
          <div className="text-4 font-bold">{article.title}</div>
          <Button variant="plain" onClick={onDeleteClick}>
            Delete
          </Button>
        </div>
        <div className="relative border-1 h-40 w-full">
          <Image
            src={article.coverImage?.src || DefaultImage}
            alt={article.title}
            fill
            className="object-cover"
            sizes="auto"
          />
        </div>
      </Link>
    </div>
  )
}

const Articles = () => {
  const { articles, fetchArticles, removeArticle } = useArticles()

  useEffect(() => {
    fetchArticles()
  }, [fetchArticles])

  return (
    <div className="grid gap-2.5 grid-cols-auto-fill-240 justify-center">
      {articles.map((article) => (
        <Article key={article.id} article={article} removeArticle={removeArticle} />
      ))}
    </div>
  )
}

export default Articles
