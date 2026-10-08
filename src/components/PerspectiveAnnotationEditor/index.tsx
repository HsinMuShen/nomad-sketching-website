import { useMemo, useState } from 'react'
import type { MouseEvent } from 'react'
import Image from 'next/image'
import type { PerspectiveAnnotation } from 'types/spatialMemory'

type AnnotationTool = 'horizon' | 'vanishing-a' | 'vanishing-b' | 'facade'

type PerspectiveAnnotationEditorProps = {
  imageSrc: string
  imageAlt: string
  value: PerspectiveAnnotation
  onChange: (value: PerspectiveAnnotation) => void
  t: (key: string) => string
}

const clamp = (value: number) => Math.max(0, Math.min(1, value))

const PerspectiveAnnotationEditor = ({ imageSrc, imageAlt, value, onChange, t }: PerspectiveAnnotationEditorProps) => {
  const [tool, setTool] = useState<AnnotationTool>('facade')
  const [imageAspectRatio, setImageAspectRatio] = useState(4 / 3)

  const facadePoints = useMemo(
    () => value.facadePoints.map((point) => `${point.x * 100},${point.y * 100}`).join(' '),
    [value],
  )

  const handleCanvasClick = (event: MouseEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const point = {
      x: clamp((event.clientX - rect.left) / rect.width),
      y: clamp((event.clientY - rect.top) / rect.height),
    }

    if (tool === 'horizon') {
      onChange({ ...value, horizonY: point.y })
      return
    }

    if (tool === 'vanishing-a' || tool === 'vanishing-b') {
      const nextVanishingPoints = value.vanishingPoints.filter(
        (vanishingPoint) => vanishingPoint.axis !== tool.slice(-1),
      )
      onChange({
        ...value,
        vanishingPoints: [...nextVanishingPoints, { ...point, axis: tool.slice(-1) as 'a' | 'b' }],
      })
      return
    }

    if (value.facadePoints.length >= 4) return
    onChange({ ...value, facadePoints: [...value.facadePoints, point] })
  }

  const reset = () => onChange({ horizonY: null, vanishingPoints: [], facadePoints: [] })
  const undoFacadePoint = () => onChange({ ...value, facadePoints: value.facadePoints.slice(0, -1) })

  const toolButton = (nextTool: AnnotationTool, label: string) => (
    <button
      type="button"
      onClick={() => setTool(nextTool)}
      className={`min-h-11 rounded-1 border px-3 py-2 text-left text-xs font-bold transition-colors ${
        tool === nextTool
          ? 'border-gray-900 bg-gray-900 text-white'
          : 'border-neutral-300 bg-white text-gray-700 hover:bg-neutral-100'
      }`}
      aria-pressed={tool === nextTool}
    >
      {label}
    </button>
  )

  return (
    <div className="overflow-hidden rounded-2 border border-neutral-200 bg-white shadow-default">
      <div className="border-b border-neutral-200 px-5 py-4 sm:px-6">
        <p className="mb-1 text-xs font-bold uppercase tracking-0.15em text-gray-500">
          {t('spatialMemory.annotationEditorLabel')}
        </p>
        <p className="text-sm leading-relaxed text-gray-600">{t('spatialMemory.annotationEditorDescription')}</p>
      </div>

      <div className="relative w-full bg-neutral-100" style={{ aspectRatio: imageAspectRatio }}>
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-contain"
          sizes="(max-width: 1024px) 100vw, 65vw"
          onLoad={(event) => {
            const image = event.currentTarget
            if (image.naturalWidth > 0 && image.naturalHeight > 0) {
              setImageAspectRatio(image.naturalWidth / image.naturalHeight)
            }
          }}
        />
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full cursor-crosshair"
          onClick={handleCanvasClick}
          role="img"
          aria-label={t('spatialMemory.annotationEditorLabel')}
        >
          {value.horizonY !== null && (
            <line
              x1="0"
              y1={value.horizonY * 100}
              x2="100"
              y2={value.horizonY * 100}
              stroke="#111111"
              strokeWidth="0.65"
              strokeDasharray="2 1"
            />
          )}
          {value.vanishingPoints.map((point) => (
            <g key={point.axis}>
              <line
                x1="0"
                y1={point.y * 100}
                x2="100"
                y2={point.y * 100}
                stroke="#666666"
                strokeWidth="0.25"
                strokeDasharray="1 2"
                opacity="0.55"
              />
              <line
                x1={point.x * 100}
                y1="0"
                x2={point.x * 100}
                y2="100"
                stroke="#666666"
                strokeWidth="0.25"
                strokeDasharray="1 2"
                opacity="0.55"
              />
              <circle
                cx={point.x * 100}
                cy={point.y * 100}
                r="2"
                fill={point.axis === 'a' ? '#111111' : '#777777'}
                stroke="white"
                strokeWidth="0.7"
              />
              <text x={point.x * 100 + 2.5} y={point.y * 100 - 2.5} fontSize="3.5" fontWeight="700" fill="#111111">
                V{point.axis.toUpperCase()}
              </text>
            </g>
          ))}
          {value.facadePoints.length > 1 && (
            <polygon points={facadePoints} fill="rgba(17,17,17,0.12)" stroke="#111111" strokeWidth="0.75" />
          )}
          {value.facadePoints.map((point, index) => (
            <g key={`${point.x}-${point.y}-${index}`}>
              <circle cx={point.x * 100} cy={point.y * 100} r="1.8" fill="#ffffff" stroke="#111111" strokeWidth="0.7" />
              <text x={point.x * 100 + 2} y={point.y * 100 + 1} fontSize="3" fontWeight="700" fill="#111111">
                {index + 1}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="space-y-4 border-t border-neutral-200 p-5 sm:p-6">
        <div className="grid gap-2 sm:grid-cols-4">
          {toolButton('horizon', t('spatialMemory.toolHorizon'))}
          {toolButton('vanishing-a', t('spatialMemory.toolVanishingA'))}
          {toolButton('vanishing-b', t('spatialMemory.toolVanishingB'))}
          {toolButton('facade', t('spatialMemory.toolFacade'))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs leading-relaxed text-gray-500">
          <p>{t(`spatialMemory.toolInstruction.${tool}`)}</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={undoFacadePoint}
              disabled={value.facadePoints.length === 0}
              className="min-h-11 rounded-1 border border-neutral-300 px-3 py-2 font-bold text-gray-700 hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {t('spatialMemory.undoPoint')}
            </button>
            <button
              type="button"
              onClick={reset}
              className="min-h-11 rounded-1 border border-gray-900 px-3 py-2 font-bold text-gray-900 hover:bg-neutral-100"
            >
              {t('spatialMemory.clearAnnotations')}
            </button>
          </div>
        </div>
        <p className="text-xs font-bold text-gray-700" aria-live="polite">
          {value.facadePoints.length}/4 {t('spatialMemory.facadePoints')} · {value.vanishingPoints.length}/2{' '}
          {t('spatialMemory.vanishingPoints')} ·{' '}
          {value.horizonY === null ? t('spatialMemory.horizonMissing') : t('spatialMemory.horizonSet')}
        </p>
      </div>
    </div>
  )
}

export default PerspectiveAnnotationEditor
