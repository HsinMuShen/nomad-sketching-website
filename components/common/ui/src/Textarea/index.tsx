import { ChangeEvent, HTMLAttributes, useState, useEffect, useRef, useMemo } from 'react'
import {
  DEFAULT_OUTLINE,
  ERROR_OUTLINE,
  HIDDEN_OUTLINE,
  DEFAULT_CLASSNAMES,
  DISABLED_CLASSNAMES,
  CONFIG_CLASSNAMES,
  ACTIVE_THEME_DICT,
  LINE_HEIGHT,
  PADDING_HEIGHT,
  ThemeType,
} from './constants'

export type TextAreaProps = {
  value?: string
  placeholder?: string
  outlined?: boolean
  disabled?: boolean
  autoSize?: boolean
  minRows?: number
  maxRows?: number
  minLength?: number
  maxLength?: number
  errorMessage?: string
  theme?: ThemeType
  onValueChange: (value: string) => void
} & HTMLAttributes<HTMLTextAreaElement>

function ErrorMessage({ message }: { message: TextAreaProps['errorMessage'] }) {
  return <div className="mr-auto min-h-4 flex-auto break-words pr-2 text-xs color-primary-500">{message}</div>
}

type CounterProps = {
  length: {
    current: number
    min: TextAreaProps['minLength']
    max: TextAreaProps['maxLength']
  }
  isError: boolean
  setValid: (value: boolean) => void
}

function Counter({ length, isError, setValid }: CounterProps) {
  const { current, min, max } = length

  const hasRange = min || max
  const rangeText = hasRange ? (max ? max : min) : ''

  const valid = useMemo(() => {
    if (min) return current > min
    if (max) return current <= max
    return false
  }, [current, min, max])
  const textColor = !valid || isError ? 'color-primary-500' : 'color-neutral-500'

  useEffect(() => {
    setValid(valid)
  }, [valid, setValid])

  return hasRange ? <span className={`ml-auto min-h-4 text-xs ${textColor}`}> {`${current}/${rangeText}`} </span> : null
}

export function TextArea({
  value,
  placeholder,
  outlined = true,
  disabled = false,
  autoSize = true,
  minRows = 2,
  maxRows = 5,
  minLength,
  maxLength,
  errorMessage,
  theme = 'primary',
  onValueChange,
  ...attrs
}: TextAreaProps) {
  const [valid, setValid] = useState(false)
  const hasErrorMessage = Boolean(errorMessage)
  const isError = hasErrorMessage || !valid
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  const outlineClassNames = outlined ? (isError ? ERROR_OUTLINE : DEFAULT_OUTLINE) : HIDDEN_OUTLINE
  const statusClassNames = disabled ? DISABLED_CLASSNAMES : [DEFAULT_CLASSNAMES, ACTIVE_THEME_DICT[theme]].join(' ')
  const classNames = [outlineClassNames, statusClassNames, CONFIG_CLASSNAMES].join(' ')

  const onTextAreaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onValueChange(event.target.value)
  }

  const resize = () => {
    if (!textAreaRef.current) return
    textAreaRef.current.style.height = 'auto'
    textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`
  }

  const length = {
    current: value?.length || 0,
    min: minLength,
    max: maxLength,
  }

  const getHeightByRows = (rows: number) => `${PADDING_HEIGHT + rows * LINE_HEIGHT}px`
  const minHeight = getHeightByRows(minRows)
  const maxHeight = getHeightByRows(maxRows)

  useEffect(() => {
    if (!textAreaRef.current) return
    textAreaRef.current.value = value || ''
    if (autoSize) resize()
  }, [value, autoSize])

  return (
    <div className="w-full flex flex-col">
      <textarea
        ref={textAreaRef}
        disabled={disabled}
        rows={minRows}
        placeholder={placeholder}
        minLength={minLength}
        maxLength={maxLength}
        className={classNames}
        onChange={onTextAreaChange}
        style={{ minHeight, maxHeight }}
        {...attrs}
      />
      <div className="flex px-2">
        {hasErrorMessage ? <ErrorMessage message={errorMessage} /> : null}
        <Counter length={length} isError={isError} setValid={setValid} />
      </div>
    </div>
  )
}

export default TextArea
