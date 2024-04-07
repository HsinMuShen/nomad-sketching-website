import { uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { getStorageRef } from 'libs/firebase'

const uploadAttachment = async (file: File) => {
  const storageRef = getStorageRef('images/' + file.name)

  const metadata = {
    contentType: 'image/jpeg',
  }

  try {
    const uploadTask = uploadBytesResumable(storageRef, file, metadata)

    uploadTask.on('state_changed', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      console.log(`Upload is ${progress}% done`)

      if (snapshot.state === 'paused') {
        console.log('Upload is paused')
      } else if (snapshot.state === 'running') {
        console.log('Upload is running')
      }
    })

    await uploadTask
    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
    console.log('File available at', downloadURL)
    return downloadURL
  } catch (error) {
    console.log('Error: An unexpected error occurred', error)
    throw error
  }
}

export default uploadAttachment
