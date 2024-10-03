import type { ChevronType, SizeType, ThemeType } from './types'
import { Fragment, useRef, useState, useEffect } from 'react'
import {
  THEME_CONFIG,
  CHEVRON_CLASSNAME,
  CHEVRON_STYLE,
  CHEVRON_WIDTH,
  CHEVRON_HEIGHT,
  Direction,
  Position,
} from './constants'
import { getCoordinate } from './utils'
const DEFAULT_CLIENT_RECT = { width: 0, height: 0, x: 0, y: 0 }

type ContentProps = {
  title?: string
  description?: string
  tags?: string[]
  theme?: ThemeType
  chevron?: ChevronType
}

type TooltipProps = {
  size?: SizeType
  children: JSX.Element
} & ContentProps

function Content({
  title = '',
  description,
  tags = [],
  theme = 'dark',
  chevron = {
    direction: Direction.Top,
    position: Position.Start,
  },
}: ContentProps) {
  const containerClassName = [
    THEME_CONFIG[theme].background,
    'relative max-w-64 w-auto flex flex-col items-center gap-1 p-2 rounded-2',
  ].join(' ')
  const titleClassName = [THEME_CONFIG[theme].title, 'text-sm-700 text-center font-sans'].join(' ')
  const descriptionClassName = [THEME_CONFIG[theme].description, 'text-xs text-center font-sans'].join(' ')
  const tagClassName = [THEME_CONFIG[theme].tag, 'rounded text-xs p-0.5 font-sans'].join(' ')
  const chevronClassName = [CHEVRON_CLASSNAME[chevron.direction], 'absolute'].join(' ')

  function Chevron() {
    return (
      <svg
        className={chevronClassName}
        style={CHEVRON_STYLE[chevron.direction][chevron.position]}
        xmlns="http://www.w3.org/2000/svg"
        width={CHEVRON_WIDTH}
        height={CHEVRON_HEIGHT}
        viewBox="0 0 10 7"
        fill="none"
      >
        <path
          d="M3.75278 0.499999C4.13768 -0.166668 5.09993 -0.166667 5.48483 0.5L9.23761 7H0L3.75278 0.499999Z"
          fill={THEME_CONFIG[theme].chevronFill}
          fillOpacity="0.8"
        />
      </svg>
    )
  }

  return (
    <div className={containerClassName}>
      <Chevron />
      <div className={titleClassName}> {title} </div>
      <div className={descriptionClassName}> {description} </div>
      {Boolean(tags.length) && (
        <div className="flex flex-wrap justify-center gap-1">
          {tags.map((tag) => (
            <div className={tagClassName} key={tag}>
              {tag}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function Tooltip({
  children,
  chevron = {
    direction: Direction.Top,
    position: Position.Start,
  },
  theme = 'dark',
  title,
  description = 'Here is a short description',
  tags,
}: TooltipProps) {
  const targetRef = useRef<HTMLSpanElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const [isTooltipVisible, setIsTooltipVisible] = useState(false)
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
  const positionStyle = useRef({})
  const className = [isTooltipVisible ? 'visible' : 'invisible', THEME_CONFIG[theme].shadow, 'absolute'].join(' ')
  const content = <Content title={title} description={description} tags={tags} theme={theme} chevron={chevron} />

  useEffect(() => {
    const currentElement = targetRef.current
    const enterListener = () => setIsTooltipVisible(true)
    const leaveListener = () => setIsTooltipVisible(false)
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    if (!currentElement) return
    currentElement.addEventListener('mouseenter', enterListener)
    currentElement.addEventListener('mouseleave', leaveListener)
    window.addEventListener('resize', handleResize)
    return () => {
      currentElement.removeEventListener('mouseenter', enterListener)
      currentElement.removeEventListener('mouseleave', leaveListener)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    requestAnimationFrame(() => {
      const targetRects = targetRef.current?.getBoundingClientRect() || DEFAULT_CLIENT_RECT
      console.log('targetRects:', targetRects)
      const tooltipRects = tooltipRef.current?.getBoundingClientRect() || DEFAULT_CLIENT_RECT
      console.log('tooltipRects:', tooltipRects)
      const { x, y } = getCoordinate({ targetRects, tooltipRects, chevron })
      console.log('x:', x, 'y:', y)
      positionStyle.current = { top: `${y}px`, left: `${x}px` }
    })
  }, [chevron, title, description, tags, windowSize])

  return (
    <Fragment>
      <span ref={targetRef}>{children}</span>
      <div role="tooltip" className={className} style={positionStyle.current} ref={tooltipRef}>
        {content}
      </div>
    </Fragment>
  )
}

export { Direction as ChevronDirection, Position as ChevronPosition } from './constants'

export default Tooltip
