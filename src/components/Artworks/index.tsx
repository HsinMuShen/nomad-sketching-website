import { useEffect, useRef } from 'react'

const RADIUS = 1400
const ITEM_SHIFT = 100

const VerticalCarousel = ({ images }: { images: string[] }) => {
  const el = useRef<HTMLDivElement>(null)
  const animId = useRef<number>(0)
  const img = useRef<HTMLDivElement>(null)

  let angleUnit: number, rotateAngle: number, viewAngle: number, mouseX: number, mouseY: number

  useEffect(() => {
    // Initialize parameters
    angleUnit = 360 / images.length
    mouseX = mouseY = 0
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

    // Animation function to rotate and animate the gallery
    const updateFrame = () => {
      rotateAngle += mouseY
      viewAngle += (mouseX - viewAngle) * 0.05
      gallery.style.transform = `translateZ(-1500px) rotateY(${-viewAngle}deg) rotateX(${rotateAngle}deg)`
      animId.current = requestAnimationFrame(updateFrame)
    }
    updateFrame()

    // Set up event listeners for mouse movement
    const mouseMoveHandler = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 10
      mouseY = (e.clientY / window.innerHeight - 0.5) * 1.25
    }

    document.body.addEventListener('mousemove', mouseMoveHandler)

    // Clean up function
    return () => {
      document.body.removeEventListener('mousemove', mouseMoveHandler)
      cancelAnimationFrame(animId.current)
    }
  }, [images]) // Dependency array ensures effect only reruns if images changes

  // Function to display the image when an item is clicked
  const pickImage = (imgUrl: string) => {
    img.current!.style.backgroundImage = `url(${imgUrl})`
    img.current!.style.transform = 'scale(1, 1)'
  }

  return (
    <div className="w-80vw h-90vh p-2 flex flex-col items-center overflow-hidden">
      <div className="carousel-container relative w-full max-w-full h-200 mx-auto my-0 overflow-hidden">
        <div className="vertical-carousel absolute top-1/2 left-1/2 cursor-pointer" ref={el}>
          {images.map(
            (it, index) => (
              console.log('it', it),
              (
                <div
                  onClick={() => pickImage(it)}
                  key={index}
                  style={{ backgroundImage: `url(${it})` }}
                  className="vertical-carousel-item absolute w-75 h-75 top-[-150px] left-[-150px] rounded-15 bg-no-repeat bg-cover bg-center"
                ></div>
              )
            ),
          )}
        </div>
        <div
          onClick={() => {
            img.current!.style.transform = 'scale(0.0, 0.0)'
          }}
          className="image-display w-80vw h-60vh fixed cursor-pointer top-10 border border-white rounded bg-no-repeat bg-cover bg-center"
          ref={img}
        ></div>
      </div>
    </div>
  )
}

export default VerticalCarousel
