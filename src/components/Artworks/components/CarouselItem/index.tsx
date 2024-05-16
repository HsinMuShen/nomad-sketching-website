import React from 'react'

interface CarouselItemProps {
  image: string
  angle: number
  radius: number
  itemShift: number
  pickImage: (image: string) => void
}

export const CarouselItem: React.FC<CarouselItemProps> = ({ image, angle, radius, itemShift, pickImage }) => {
  const itemAngleRad = (angle * Math.PI) / 180
  const ypos = Math.sin(itemAngleRad) * radius
  const zpos = Math.cos(itemAngleRad) * radius
  const ypos1 = Math.sin(itemAngleRad) * (radius + itemShift)
  const zpos1 = Math.cos(itemAngleRad) * (radius + itemShift)

  return (
    <div
      onClick={() => pickImage(image)}
      style={{
        backgroundImage: `url(${image})`,
        transform: `translateY(${ypos}px) translateZ(${zpos}px) rotateX(${-angle}deg)`,
      }}
      onMouseOver={(e) =>
        (e.currentTarget.style.transform = `translateY(${ypos1}px) translateZ(${zpos1}px) rotateX(${-angle}deg)`)
      }
      onMouseOut={(e) =>
        (e.currentTarget.style.transform = `translateY(${ypos}px) translateZ(${zpos}px) rotateX(${-angle}deg)`)
      }
      className="vertical-carousel-item absolute w-75 h-75 top-[-150px] left-[-150px] rounded-15 bg-no-repeat bg-cover bg-center"
    ></div>
  )
}
