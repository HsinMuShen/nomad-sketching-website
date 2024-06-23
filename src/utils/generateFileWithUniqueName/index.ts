export const generateFileWithUniqueName = (file: File) => {
  const uniqueName = file.name + '_' + Date.now()
  return new File([file], uniqueName, {
    type: file.type,
    lastModified: file.lastModified,
  })
}
