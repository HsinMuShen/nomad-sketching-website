import { useEffect, useRef, useState } from 'react'
import CarouselItem from './components/CarouselItem'
import ImageDisplay from './components/ImageDisplay'

const RADIUS = 1400
const ITEM_SHIFT = 100

type Images = {
  url: string
  name: string
}

const VerticalCarousel = ({ images }: { images: Images[] }) => {
  const el = useRef<HTMLDivElement>(null)
  const animId = useRef<number>(0)
  const img = useRef<HTMLDivElement>(null)

  const [isDragging, setIsDragging] = useState(false)
  const [backgroundPosition, setBackgroundPosition] = useState({ x: 0, y: 0 })
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 })
  const [isImageCover, setIsImageCover] = useState(false)
  const [imageTitle, setImageTitle] = useState('')

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

  let angleUnit: number, rotateAngle: number, viewAngle: number, mouseX: number, mouseY: number

  useEffect(() => {
    // Initialize parameters
    angleUnit = 360 / images.length
    mouseX = 0.1
    mouseY = 0
    rotateAngle = 0
    viewAngle = 0

    const items = el.current!.children

    // Configure the initial transformation for each item
    for (let i = 0; i < items.length; i++) {
      const item = items[i] as HTMLDivElement
      const itemAngle = angleUnit * i
      const itemAngleRad = (itemAngle * Math.PI) / 180
      const ypos = Math.sin(itemAngleRad) * RADIUS
      const zpos = Math.cos(itemAngleRad) * RADIUS
      const ypos1 = Math.sin(itemAngleRad) * (RADIUS + ITEM_SHIFT)
      const zpos1 = Math.cos(itemAngleRad) * (RADIUS + ITEM_SHIFT)
      item.style.transform = `translateY(${ypos}px) translateZ(${zpos}px) rotateX(${-itemAngle}deg)`
      item.onmouseover = () => {
        item.style.transform = `translateY(${ypos1}px) translateZ(${zpos1}px) rotateX(${-itemAngle}deg)`
      }
      item.onmouseout = () => {
        item.style.transform = `translateY(${ypos}px) translateZ(${zpos}px) rotateX(${-itemAngle}deg)`
      }
    }

    const gallery = el.current!

    const updateFrame = () => {
      rotateAngle += 0.08 - mouseY
      viewAngle += (mouseX - viewAngle) * 0.05
      gallery.style.transform = `translateZ(-1500px) rotateY(${viewAngle}deg) rotateX(${-rotateAngle}deg)`
      animId.current = requestAnimationFrame(updateFrame)
    }
    updateFrame()

    const mouseMoveHandler = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 10
    }

    const scrollHandler = (e: WheelEvent) => {
      const deltaY = e.deltaY * 0.1
      mouseY = deltaY
    }

    let startY: number
    const touchStartHandler = (e: TouchEvent) => {
      const touchY = e.touches[0].clientY
      startY = touchY
      mouseY = 0
    }

    const touchMoveHandler = (e: TouchEvent) => {
      const touchY = e.touches[0].clientY
      mouseY = -(touchY - startY) * 0.001
    }

    document.body.addEventListener('mousemove', mouseMoveHandler)
    document.body.addEventListener('wheel', scrollHandler)
    document.body.addEventListener('touchstart', touchStartHandler)
    document.body.addEventListener('touchmove', touchMoveHandler)

    return () => {
      document.body.removeEventListener('mousemove', mouseMoveHandler)
      document.body.removeEventListener('wheel', scrollHandler)
      document.body.removeEventListener('touchstart', touchStartHandler)
      document.body.removeEventListener('touchmove', touchMoveHandler)
      cancelAnimationFrame(animId.current)
    }
  }, [images])

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
