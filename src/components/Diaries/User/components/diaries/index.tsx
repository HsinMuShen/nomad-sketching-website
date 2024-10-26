import type { DiaryType } from 'types/diary'
import Image from 'next/image'
import Link from 'next/link'

type DiariesProps = {
  diaries: DiaryType[]
}

const Diaries = ({ diaries }: DiariesProps) => {
  const sortedDiaries = diaries.sort((a, b) => Number(b.id) - Number(a.id))
  return (
    <div className="grid gap-5 grid-cols-auto-fill-240 justify-center">
      {sortedDiaries.map((diary) => (
        <Diary key={diary.id} diary={diary} />
      ))}
    </div>
  )
}

export default Diaries

type DiaryProps = {
  diary: DiaryType
}

const Diary = ({ diary }: DiaryProps) => {
  const { id, title, drawingImage, createdAt } = diary

  const getCreatedTime = (createTime: number) => {
    const date = new Date(createTime)
    return date.toLocaleDateString()
  }

  return (
    <Link href={`/diary/${id}`}>
      <div className="w-60 my-2" key={id}>
        <div className="flex justify-between items-end mb-1">
          <div className="text-4 font-bold text-ellipsis whitespace-nowrap overflow-hidden h-7 max-w-35">{title}</div>
          <div className="text-3 mr-2">{createdAt && getCreatedTime(createdAt)}</div>
        </div>
        <div className="relative border-1 h-40 w-full overflow-hidden">
          <Image
            src={drawingImage.src}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 scale-100 hover:scale-120"
            sizes="auto"
          />
        </div>
      </div>
    </Link>
  )
}
