import { ImageData } from 'types/image'
import { uploadAttachment } from 'utils/attachment'
import { generateFileWithUniqueName } from 'utils/generateFileWithUniqueName'

export const getImageFileUrl = async (file: File): Promise<ImageData> => {
  const updatedFile = generateFileWithUniqueName(file)
  const url = await uploadAttachment(updatedFile)

  const image = {
    id: updatedFile.name,
    src: url,
  }

  return image
}
