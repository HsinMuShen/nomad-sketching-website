import type { DiaryType } from 'types/diary'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { readData } from 'utils/dataHandler'
import { DATA_BASE_NAMES } from 'constants/database'

const AdminDiaryComponent = () => {
  const [diaries, setDiaries] = useState<DiaryType[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const diaries = await readData<DiaryType>(DATA_BASE_NAMES.DIARY)
      setDiaries(diaries)
    }
    fetchData()
  }, [])

  return (
    <div className="mb-10">
      <div className="grid gap-5 grid-cols-auto-fill-240 justify-center">
        {diaries.map(({ id, title, drawingImage }) => (
          <Link href={`/diary/${id}`} key={id}>
            <div className="w-60 my-2">
              <div className="text-4 font-bold mb-1">{title}</div>
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
        ))}
      </div>
    </div>
  )
}

export default AdminDiaryComponent
