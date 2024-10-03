import type { DiaryType } from 'types/diary'
import { readData } from 'utils/dataHandler'
import { DATA_BASE_NAMES } from 'constants/database'

export const fetchDiaries = async () => {
  const diaries = await readData<DiaryType>(DATA_BASE_NAMES.DIARY)
  return diaries
}
