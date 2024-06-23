import type { Artwork } from 'types/artworks'
import { useState } from 'react'
import CarouselItem from './components/CarouselItem'
import ImageDisplay from './components/ImageDisplay'
import useCarousel from './hooks/use-carousel'

const CarouselArtworks = ({ images }: { images: Artwork[] }) => {
  const [isDragging, setIsDragging] = useState(false)
  const [backgroundPosition, setBackgroundPosition] = useState({ x: 0, y: 0 })
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 })
  const [isImageCover, setIsImageCover] = useState(false)
  const [imageTitle, setImageTitle] = useState('')
  const [selectedArtworkId, setSelectedArtworkId] = useState('')

  const { el, img } = useCarousel(images)

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true)

    setStartPosition({
      x: e.clientX,
      y: e.clientY,
    })
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      const deltaX = e.clientX - startPosition.x
      const deltaY = e.clientY - startPosition.y
      setBackgroundPosition((prevPos) => ({
        x: prevPos.x + deltaX,
        y: prevPos.y + deltaY,
      }))
      setStartPosition({
        x: e.clientX,
        y: e.clientY,
      })
    }
  }

  const renderBackgroundPosition = () => {
    const posX = `calc(50% + ${backgroundPosition.x}px)`
    const posY = `calc(50% + ${backgroundPosition.y}px)`
    return `${posX} ${posY}`
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const pickImage = (imgUrl: string, name: string, id: string) => {
    img.current!.style.backgroundImage = `url(${imgUrl})`
    img.current!.style.transform = 'scale(1, 1)'
    setBackgroundPosition({ x: 0, y: 0 })
    setImageTitle(name)
    setSelectedArtworkId(id)
  }

  return (
    <div className="w-80vw h-80vh sm:h-90vh p-2 flex flex-col items-center overflow-hidden">
      <div className="carousel-container relative w-full max-w-full h-200 mx-auto my-0 overflow-hidden">
        <div className="vertical-carousel absolute top-1/2 left-1/2 cursor-pointer" ref={el}>
          {images.map(({ mainImage, name, id }) => (
            <CarouselItem key={id} url={mainImage?.src || ''} name={name} id={id} onClick={pickImage} />
          ))}
        </div>
        <ImageDisplay
          handleMouseDown={handleMouseDown}
          handleMouseMove={handleMouseMove}
          handleMouseUp={handleMouseUp}
          isImageCover={isImageCover}
          setIsImageCover={setIsImageCover}
          renderBackgroundPosition={renderBackgroundPosition}
          setBackgroundPosition={setBackgroundPosition}
          imgRef={img}
          imageTitle={imageTitle}
          id={selectedArtworkId}
        />
      </div>
    </div>
  )
}

export default CarouselArtworks
