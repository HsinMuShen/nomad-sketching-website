import { useRef, useEffect } from 'react'

const RADIUS = 1400
const ITEM_SHIFT = 100

export type Image = {
  url: string
  name: string
}

const useCarousel = (images: Image[]) => {
  const el = useRef<HTMLDivElement>(null)
  const animId = useRef<number>(0)
  const img = useRef<HTMLDivElement>(null)

  let angleUnit: number, rotateAngle: number, viewAngle: number, mouseX: number, mouseY: number

  useEffect(() => {
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

  return {
    el,
    img,
  }
}

export default useCarousel
