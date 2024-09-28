import type { DiaryType } from 'types/diary'
import Image from 'next/image'
import Link from 'next/link'
import { IconButton } from 'components/common/ui'
import useDeleteDiary from 'components/Diaries/Admin/hooks/use-delete-diary'

type DiariesProps = {
  diaries: DiaryType[]
  updateDiaries: () => void
}

const Diaries = ({ diaries, updateDiaries }: DiariesProps) => {
  return (
    <div className="grid gap-5 grid-cols-auto-fill-240 justify-center">
      {diaries.map((diary) => (
        <Diary key={diary.id} diary={diary} updateDiaries={updateDiaries} />
      ))}
    </div>
  )
}

export default Diaries

type DiaryProps = {
  diary: DiaryType
  updateDiaries: () => void
}

const Diary = ({ diary, updateDiaries }: DiaryProps) => {
  const { id, title, drawingImage, createdAt } = diary
  const { deleteDiary } = useDeleteDiary()

  const getCreatedTime = (createTime: number) => {
    const date = new Date(createTime)
    return date.toLocaleDateString()
  }

  const onDeleteClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    deleteDiary(id)
    updateDiaries()
  }

  return (
    <div className="w-60 my-2" key={id}>
      <div className="flex justify-between items-end mb-1">
        <Link href={`/admin/diary/update/${id}`}>
          <div className="text-4 font-bold">{title}</div>
        </Link>
        <div className="flex items-end">
          <div className="text-3 mr-2">{createdAt && getCreatedTime(createdAt)}</div>
          <IconButton
            aria-label="image-delete"
            icon="i-mdi-trash-can"
            size="2xl"
            variant="plain"
            hasPadding={false}
            onClick={onDeleteClick}
          />
        </div>
      </div>
      <Link href={`/admin/diary/update/${id}`}>
        <div className="relative border-1 h-40 w-full overflow-hidden">
          <Image
            src={drawingImage.src}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 scale-100 hover:scale-120"
            sizes="auto"
          />
        </div>
      </Link>
    </div>
  )
}
