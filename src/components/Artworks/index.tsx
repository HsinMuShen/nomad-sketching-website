import type { Image } from './hooks/use-carousel'
import { useState } from 'react'
import CarouselItem from './components/CarouselItem'
import ImageDisplay from './components/ImageDisplay'
import useCarousel from './hooks/use-carousel'

const VerticalCarousel = ({ images }: { images: Image[] }) => {
  const [isDragging, setIsDragging] = useState(false)
  const [backgroundPosition, setBackgroundPosition] = useState({ x: 0, y: 0 })
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 })
  const [isImageCover, setIsImageCover] = useState(false)
  const [imageTitle, setImageTitle] = useState('')

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

  const pickImage = (imgUrl: string, name: string) => {
    img.current!.style.backgroundImage = `url(${imgUrl})`
    img.current!.style.transform = 'scale(1, 1)'
    setBackgroundPosition({ x: 0, y: 0 })
    setImageTitle(name)
  }

  return (
    <div className="w-80vw h-80vh sm:h-90vh p-2 flex flex-col items-center overflow-hidden">
      <div className="carousel-container relative w-full max-w-full h-200 mx-auto my-0 overflow-hidden">
        <div className="vertical-carousel absolute top-1/2 left-1/2 cursor-pointer" ref={el}>
          {images.map(({ url, name }) => (
            <CarouselItem key={url} url={url} name={name} onClick={pickImage} />
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
        />
      </div>
    </div>
  )
}

export default VerticalCarousel
