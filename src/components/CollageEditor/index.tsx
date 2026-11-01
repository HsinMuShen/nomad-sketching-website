import { useCallback, useEffect, useRef, useState } from 'react'
import * as fabric from 'fabric'
import type { Artwork } from 'types/artworks'
import { getArtworkName } from 'utils/localization/artwork'
import { useI18n } from 'libs/i18n'
import styles from './CollageEditor.module.css'

type CanvasSize = {
  label: string
  width: number
  height: number
}

type CropValue = {
  top: number
  right: number
  bottom: number
  left: number
}

type HistoryState = {
  canvas: ReturnType<fabric.Canvas['toJSON']>
  size: CanvasSize
  backgroundColor: string
}

const CANVAS_PRESETS: CanvasSize[] = [
  { label: 'Square · 1080 × 1080', width: 1080, height: 1080 },
  { label: 'Portrait · 1080 × 1350', width: 1080, height: 1350 },
  { label: 'Story · 1080 × 1920', width: 1080, height: 1920 },
  { label: 'Landscape · 1350 × 1080', width: 1350, height: 1080 },
]

const EMPTY_CROP: CropValue = { top: 0, right: 0, bottom: 0, left: 0 }
const DEFAULT_BACKGROUND = '#f7f5f0'
const HISTORY_LIMIT = 30

const getImageSourceSize = (image: fabric.FabricImage) => {
  const element = image.getElement() as HTMLImageElement
  return {
    width: element.naturalWidth || element.width || image.width,
    height: element.naturalHeight || element.height || image.height,
  }
}

const ToolIcon = ({ name }: { name: string }) => <span aria-hidden="true" className={`${styles.icon} i-mdi-${name}`} />

const CollageEditor = ({ artworks }: { artworks: Artwork[] }) => {
  const canvasElementRef = useRef<HTMLCanvasElement>(null)
  const canvasRef = useRef<fabric.Canvas | null>(null)
  const workspaceRef = useRef<HTMLDivElement>(null)
  const canvasSizeRef = useRef<CanvasSize>(CANVAS_PRESETS[0])
  const historyRef = useRef<string[]>([])
  const historyIndexRef = useRef(-1)
  const isRestoringRef = useRef(false)
  const objectNamesRef = useRef(new WeakMap<fabric.Object, string>())
  const objectIdsRef = useRef(new WeakMap<fabric.Object, number>())
  const nextObjectIdRef = useRef(1)
  const cropModeRef = useRef(false)
  const pendingCropRectRef = useRef<fabric.Rect | null>(null)
  const cropTargetRef = useRef<fabric.FabricImage | null>(null)
  const lockedCropImageRef = useRef<fabric.FabricImage | null>(null)
  const objectUrlsRef = useRef<string[]>([])

  const [canvasSize, setCanvasSize] = useState(CANVAS_PRESETS[0])
  const [backgroundColor, setBackgroundColor] = useState(DEFAULT_BACKGROUND)
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null)
  const [layers, setLayers] = useState<fabric.Object[]>([])
  const [crop, setCrop] = useState<CropValue>(EMPTY_CROP)
  const [opacity, setOpacity] = useState(100)
  const [rotation, setRotation] = useState(0)
  const [zoom, setZoom] = useState(100)
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)
  const [status, setStatus] = useState('上傳圖片開始製作 collage')
  const [libraryOpen, setLibraryOpen] = useState(false)
  const [cropMode, setCropMode] = useState(false)
  const { locale } = useI18n()
  const tx = (zh: string, en: string) => (locale === 'zh' ? zh : en)
  cropModeRef.current = cropMode

  const updateHistoryControls = useCallback(() => {
    setCanUndo(historyIndexRef.current > 0)
    setCanRedo(historyIndexRef.current < historyRef.current.length - 1)
  }, [])

  const refreshLayers = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    setLayers([...canvas.getObjects()].reverse())
  }, [])

  const saveSnapshot = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || isRestoringRef.current) return

    const state: HistoryState = {
      canvas: canvas.toJSON(),
      size: canvasSizeRef.current,
      backgroundColor: String(canvas.backgroundColor || 'transparent'),
    }
    const snapshot = JSON.stringify(state)
    if (historyRef.current[historyIndexRef.current] === snapshot) return

    const nextHistory = historyRef.current.slice(0, historyIndexRef.current + 1)
    nextHistory.push(snapshot)
    if (nextHistory.length > HISTORY_LIMIT) nextHistory.shift()
    historyRef.current = nextHistory
    historyIndexRef.current = nextHistory.length - 1
    updateHistoryControls()
  }, [updateHistoryControls])

  const resizeCanvasToWorkspace = useCallback(() => {
    const canvas = canvasRef.current
    const workspace = workspaceRef.current
    if (!canvas || !workspace) return

    const size = canvasSizeRef.current
    const availableWidth = Math.max(260, workspace.clientWidth - 64)
    const availableHeight = Math.max(320, workspace.clientHeight - 72)
    const scale = Math.min(availableWidth / size.width, availableHeight / size.height, 1)
    canvas.setDimensions({
      width: Math.round(size.width * scale),
      height: Math.round(size.height * scale),
    })
    canvas.setViewportTransform([scale, 0, 0, scale, 0, 0])
    canvas.requestRenderAll()
    setZoom(Math.round(scale * 100))
  }, [])

  const syncSelection = useCallback(() => {
    const canvas = canvasRef.current
    const active = canvas?.getActiveObject() || null
    setSelectedObject(active)

    if (!active) {
      setCrop(EMPTY_CROP)
      setOpacity(100)
      setRotation(0)
      return
    }

    setOpacity(Math.round((active.opacity ?? 1) * 100))
    setRotation(Math.round(active.angle ?? 0))

    if (active instanceof fabric.FabricImage) {
      const source = getImageSourceSize(active)
      setCrop({
        top: Math.round(((active.cropY || 0) / source.height) * 100),
        left: Math.round(((active.cropX || 0) / source.width) * 100),
        right: Math.round(((source.width - (active.cropX || 0) - active.width) / source.width) * 100),
        bottom: Math.round(((source.height - (active.cropY || 0) - active.height) / source.height) * 100),
      })
    } else {
      setCrop(EMPTY_CROP)
    }
  }, [])

  const restoreSnapshot = useCallback(
    async (snapshot: string) => {
      const canvas = canvasRef.current
      if (!canvas) return

      isRestoringRef.current = true
      const state = JSON.parse(snapshot) as HistoryState
      canvasSizeRef.current = state.size
      setCanvasSize(state.size)
      setBackgroundColor(state.backgroundColor === 'transparent' ? DEFAULT_BACKGROUND : state.backgroundColor)
      await canvas.loadFromJSON(state.canvas)
      canvas.backgroundColor = state.backgroundColor === 'transparent' ? '' : state.backgroundColor
      canvas.discardActiveObject()
      resizeCanvasToWorkspace()
      refreshLayers()
      syncSelection()
      isRestoringRef.current = false
    },
    [refreshLayers, resizeCanvasToWorkspace, syncSelection],
  )

  const undo = useCallback(() => {
    if (historyIndexRef.current <= 0) return
    historyIndexRef.current -= 1
    void restoreSnapshot(historyRef.current[historyIndexRef.current])
    updateHistoryControls()
    setStatus(tx('已復原上一個動作', 'Undo complete'))
  }, [restoreSnapshot, updateHistoryControls])

  const redo = useCallback(() => {
    if (historyIndexRef.current >= historyRef.current.length - 1) return
    historyIndexRef.current += 1
    void restoreSnapshot(historyRef.current[historyIndexRef.current])
    updateHistoryControls()
    setStatus(tx('已重做動作', 'Redo complete'))
  }, [restoreSnapshot, updateHistoryControls])

  useEffect(() => {
    if (!canvasElementRef.current || canvasRef.current) return

    const canvas = new fabric.Canvas(canvasElementRef.current, {
      width: canvasSizeRef.current.width,
      height: canvasSizeRef.current.height,
      backgroundColor: DEFAULT_BACKGROUND,
      preserveObjectStacking: true,
      selectionColor: 'rgba(124, 58, 237, 0.12)',
      selectionBorderColor: '#7c3aed',
    })
    canvasRef.current = canvas

    const handleSelection = () => syncSelection()
    const handleModified = () => {
      saveSnapshot()
      refreshLayers()
      syncSelection()
    }

    canvas.on('selection:created', handleSelection)
    canvas.on('selection:updated', handleSelection)
    canvas.on('selection:cleared', handleSelection)
    canvas.on('object:modified', handleModified)

    let cropStart: fabric.Point | null = null
    let cropRect: fabric.Rect | null = null
    canvas.on('mouse:down', ({ scenePoint }) => {
      if (!cropModeRef.current || !lockedCropImageRef.current) return
      cropStart = scenePoint
      cropRect = new fabric.Rect({
        left: scenePoint.x,
        top: scenePoint.y,
        width: 1,
        height: 1,
        fill: 'rgba(255,255,255,0.18)',
        stroke: '#333333',
        strokeWidth: 2,
        strokeDashArray: [8, 5],
        selectable: false,
        evented: false,
      })
      canvas.add(cropRect)
    })
    canvas.on('mouse:move', ({ scenePoint }) => {
      if (!cropStart || !cropRect) return
      cropRect.set({
        left: Math.min(cropStart.x, scenePoint.x),
        top: Math.min(cropStart.y, scenePoint.y),
        width: Math.abs(scenePoint.x - cropStart.x),
        height: Math.abs(scenePoint.y - cropStart.y),
      })
      canvas.requestRenderAll()
    })
    canvas.on('mouse:up', () => {
      if (!cropStart || !cropRect) return
      const rect = cropRect
      cropStart = null
      cropRect = null
      const active = lockedCropImageRef.current
      if (!(active instanceof fabric.FabricImage) || rect.width < 4 || rect.height < 4) return
      cropTargetRef.current = active
      pendingCropRectRef.current = rect
      rect.set({
        selectable: true,
        evented: true,
        hasRotatingPoint: false,
        cornerColor: '#555555',
        cornerStrokeColor: '#ffffff',
        transparentCorners: false,
        strokeDashArray: [6, 4],
      })
      canvas.setActiveObject(rect)
      canvas.requestRenderAll()
      setStatus(
        tx('可移動或拖曳控制點調整裁切框，按「套用裁切」確認', 'Move or resize the crop frame, then apply to confirm'),
      )
    })

    resizeCanvasToWorkspace()
    saveSnapshot()

    const resizeObserver = new ResizeObserver(resizeCanvasToWorkspace)
    if (workspaceRef.current) resizeObserver.observe(workspaceRef.current)

    return () => {
      resizeObserver.disconnect()
      canvas.dispose()
      canvasRef.current = null
    }
  }, [refreshLayers, resizeCanvasToWorkspace, saveSnapshot, syncSelection])

  useEffect(
    () => () => {
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url))
      objectUrlsRef.current = []
    },
    [],
  )

  const removeSelected = useCallback(() => {
    const canvas = canvasRef.current
    const active = canvas?.getActiveObject()
    if (!canvas || !active) return
    canvas.remove(active)
    canvas.discardActiveObject()
    canvas.requestRenderAll()
    refreshLayers()
    syncSelection()
    saveSnapshot()
    setStatus(tx('已刪除選取的圖片', 'Image deleted'))
  }, [refreshLayers, saveSnapshot, syncSelection])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName)) return

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'z') {
        event.preventDefault()
        if (event.shiftKey) redo()
        else undo()
        return
      }

      const canvas = canvasRef.current
      const active = canvas?.getActiveObject()
      if (!canvas || !active) return

      if (event.key === 'Delete' || event.key === 'Backspace') {
        event.preventDefault()
        removeSelected()
        return
      }

      const moveBy = event.shiftKey ? 10 : 1
      const directions: Record<string, [number, number]> = {
        ArrowLeft: [-moveBy, 0],
        ArrowRight: [moveBy, 0],
        ArrowUp: [0, -moveBy],
        ArrowDown: [0, moveBy],
      }
      const movement = directions[event.key]
      if (!movement) return
      event.preventDefault()
      active.set({ left: (active.left || 0) + movement[0], top: (active.top || 0) + movement[1] })
      active.setCoords()
      canvas.requestRenderAll()
      saveSnapshot()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [redo, removeSelected, saveSnapshot, undo])

  const addArtwork = async (artwork: Artwork) => {
    const canvas = canvasRef.current
    const sourceUrl = artwork.mainImage?.src
    if (!canvas || !sourceUrl) return

    setStatus(tx('正在載入作品…', 'Loading artwork…'))
    try {
      const imageProxyUrl = `/api/collage-image?src=${encodeURIComponent(sourceUrl)}`
      const image = await fabric.FabricImage.fromURL(imageProxyUrl, { crossOrigin: 'anonymous' })
      const size = canvasSizeRef.current
      const scale = Math.min((size.width * 0.54) / image.width, (size.height * 0.54) / image.height, 1)
      image.set({
        left: size.width * 0.22 + (layers.length % 4) * 28,
        top: size.height * 0.22 + (layers.length % 4) * 28,
        scaleX: scale,
        scaleY: scale,
        cornerColor: '#7c3aed',
        cornerStrokeColor: '#ffffff',
        borderColor: '#7c3aed',
        transparentCorners: false,
      })
      objectNamesRef.current.set(image, getArtworkName(artwork, locale))
      canvas.add(image)
      canvas.setActiveObject(image)
      canvas.requestRenderAll()
      refreshLayers()
      syncSelection()
      saveSnapshot()
      setLibraryOpen(false)
      setStatus(
        tx(`「${getArtworkName(artwork, locale)}」已加入畫布`, `“${getArtworkName(artwork, locale)}” added to canvas`),
      )
    } catch {
      setStatus(tx('作品圖片載入失敗，請稍後再試', 'Could not load artwork. Please try again.'))
    }
  }

  const arrangeImages = (layout: 'grid' | 'strip' | 'scatter') => {
    const canvas = canvasRef.current
    if (!canvas) return
    const images = canvas
      .getObjects()
      .filter((object): object is fabric.FabricImage => object instanceof fabric.FabricImage)
    if (images.length === 0) {
      setLibraryOpen(true)
      return
    }

    const { width, height } = canvasSizeRef.current
    const gap = Math.max(18, Math.round(width * 0.018))

    if (layout === 'grid' || layout === 'strip') {
      const columns = layout === 'strip' ? images.length : Math.ceil(Math.sqrt(images.length))
      const rows = layout === 'strip' ? 1 : Math.ceil(images.length / columns)
      const cellWidth = (width - gap * (columns + 1)) / columns
      const cellHeight = (height - gap * (rows + 1)) / rows

      images.forEach((image, index) => {
        const column = index % columns
        const row = Math.floor(index / columns)
        const scale = Math.min(cellWidth / image.width, cellHeight / image.height)
        image.set({
          angle: 0,
          scaleX: scale,
          scaleY: scale,
          left: gap + column * (cellWidth + gap) + (cellWidth - image.width * scale) / 2,
          top: gap + row * (cellHeight + gap) + (cellHeight - image.height * scale) / 2,
        })
        image.setCoords()
      })
    } else {
      const rotations = [-7, 4, -3, 8, -5, 2]
      images.forEach((image, index) => {
        const scale = Math.min((width * 0.44) / image.width, (height * 0.44) / image.height)
        const column = index % 2
        const row = Math.floor(index / 2)
        image.set({
          angle: rotations[index % rotations.length],
          scaleX: scale,
          scaleY: scale,
          left: width * (column === 0 ? 0.09 : 0.52) + (index % 3) * 10,
          top: height * (0.08 + row * 0.29),
        })
        image.setCoords()
      })
    }

    canvas.discardActiveObject()
    canvas.requestRenderAll()
    refreshLayers()
    syncSelection()
    saveSnapshot()
    setStatus(
      layout === 'grid'
        ? tx('已套用網格版型', 'Grid layout applied')
        : layout === 'strip'
          ? tx('已套用橫向版型', 'Strip layout applied')
          : tx('已套用自由拼貼版型', 'Freeform layout applied'),
    )
  }

  const changeCanvasSize = (index: number) => {
    const canvas = canvasRef.current
    const nextSize = CANVAS_PRESETS[index]
    if (!canvas || !nextSize) return
    const previousSize = canvasSizeRef.current
    const ratio = Math.min(nextSize.width / previousSize.width, nextSize.height / previousSize.height)
    canvas.getObjects().forEach((object) => {
      object.set({
        left: (object.left || 0) * (nextSize.width / previousSize.width),
        top: (object.top || 0) * (nextSize.height / previousSize.height),
        scaleX: (object.scaleX || 1) * ratio,
        scaleY: (object.scaleY || 1) * ratio,
      })
      object.setCoords()
    })
    canvasSizeRef.current = nextSize
    setCanvasSize(nextSize)
    resizeCanvasToWorkspace()
    saveSnapshot()
    setStatus(tx(`畫布已改為 ${nextSize.label}`, `Canvas resized to ${nextSize.width} × ${nextSize.height}`))
  }

  const applyCrop = () => {
    const canvas = canvasRef.current
    const pendingRect = pendingCropRectRef.current
    const target = cropTargetRef.current
    if (canvas && pendingRect && target) {
      const rect = pendingRect.getBoundingRect()
      const targetRect = target.getBoundingRect()
      const left = Math.max(targetRect.left, rect.left)
      const top = Math.max(targetRect.top, rect.top)
      const right = Math.min(targetRect.left + targetRect.width, rect.left + rect.width)
      const bottom = Math.min(targetRect.top + targetRect.height, rect.top + rect.height)
      if (right - left < 4 || bottom - top < 4) {
        setStatus(tx('裁切框需與圖片重疊', 'The crop frame must overlap the image'))
        return
      }
      const sx = target.getScaledWidth() / target.width
      const sy = target.getScaledHeight() / target.height
      target.set({
        cropX: (target.cropX || 0) + (left - targetRect.left) / sx,
        cropY: (target.cropY || 0) + (top - targetRect.top) / sy,
        width: (right - left) / sx,
        height: (bottom - top) / sy,
        left,
        top,
      })
      canvas.remove(pendingRect)
      target.set({ selectable: true, evented: true })
      lockedCropImageRef.current = null
      pendingCropRectRef.current = null
      cropTargetRef.current = null
      canvas.setActiveObject(target)
      target.setCoords()
      canvas.requestRenderAll()
      setCropMode(false)
      saveSnapshot()
      syncSelection()
      setStatus(tx('裁切已套用', 'Crop applied'))
      return
    }
    if (!canvas || !(selectedObject instanceof fabric.FabricImage)) return
    const source = getImageSourceSize(selectedObject)
    const horizontalRemaining = 100 - crop.left - crop.right
    const verticalRemaining = 100 - crop.top - crop.bottom
    if (horizontalRemaining < 10 || verticalRemaining < 10) {
      setStatus(tx('裁切範圍至少要保留圖片的 10%', 'Keep at least 10% of the image'))
      return
    }

    const renderedWidth = selectedObject.getScaledWidth()
    const renderedHeight = selectedObject.getScaledHeight()
    const width = source.width * (horizontalRemaining / 100)
    const height = source.height * (verticalRemaining / 100)
    selectedObject.set({
      cropX: source.width * (crop.left / 100),
      cropY: source.height * (crop.top / 100),
      width,
      height,
      scaleX: renderedWidth / width,
      scaleY: renderedHeight / height,
    })
    selectedObject.setCoords()
    canvas.requestRenderAll()
    saveSnapshot()
    setStatus(tx('裁切已套用', 'Crop applied'))
  }

  const cancelCrop = () => {
    const canvas = canvasRef.current
    if (canvas && pendingCropRectRef.current) canvas.remove(pendingCropRectRef.current)
    if (lockedCropImageRef.current) lockedCropImageRef.current.set({ selectable: true, evented: true })
    lockedCropImageRef.current = null
    pendingCropRectRef.current = null
    cropTargetRef.current = null
    setCropMode(false)
    canvas?.requestRenderAll()
    setStatus(tx('已取消裁切', 'Crop cancelled'))
  }

  useEffect(() => {
    const handleCropKeys = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && pendingCropRectRef.current) {
        event.preventDefault()
        applyCrop()
      }
      if (event.key === 'Escape' && pendingCropRectRef.current) {
        event.preventDefault()
        cancelCrop()
      }
    }
    window.addEventListener('keydown', handleCropKeys)
    return () => window.removeEventListener('keydown', handleCropKeys)
  })

  const resetCrop = () => {
    const canvas = canvasRef.current
    if (!canvas || !(selectedObject instanceof fabric.FabricImage)) return
    const source = getImageSourceSize(selectedObject)
    const renderedWidth = selectedObject.getScaledWidth()
    const renderedHeight = selectedObject.getScaledHeight()
    selectedObject.set({
      cropX: 0,
      cropY: 0,
      width: source.width,
      height: source.height,
      scaleX: renderedWidth / source.width,
      scaleY: renderedHeight / source.height,
    })
    selectedObject.setCoords()
    setCrop(EMPTY_CROP)
    canvas.requestRenderAll()
    saveSnapshot()
    setStatus(tx('已還原原始圖片範圍', 'Original image restored'))
  }

  const updateSelectedProperty = (property: 'opacity' | 'angle', value: number) => {
    const canvas = canvasRef.current
    if (!canvas || !selectedObject) return
    selectedObject.set(property, property === 'opacity' ? value / 100 : value)
    selectedObject.setCoords()
    canvas.requestRenderAll()
    if (property === 'opacity') setOpacity(value)
    else setRotation(value)
  }

  const moveLayer = (direction: 'up' | 'down') => {
    const canvas = canvasRef.current
    if (!canvas || !selectedObject) return
    if (direction === 'up') canvas.bringObjectForward(selectedObject)
    else canvas.sendObjectBackwards(selectedObject)
    canvas.requestRenderAll()
    refreshLayers()
    saveSnapshot()
  }

  const duplicateSelected = async () => {
    const canvas = canvasRef.current
    if (!canvas || !selectedObject) return
    const clone = await selectedObject.clone()
    clone.set({ left: (selectedObject.left || 0) + 28, top: (selectedObject.top || 0) + 28 })
    canvas.add(clone)
    canvas.setActiveObject(clone)
    canvas.requestRenderAll()
    refreshLayers()
    syncSelection()
    saveSnapshot()
    setStatus(tx('已複製選取的圖片', 'Image duplicated'))
  }

  const selectLayer = (object: fabric.Object) => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.setActiveObject(object)
    canvas.requestRenderAll()
    syncSelection()
  }

  const toggleLayerVisibility = (object: fabric.Object) => {
    object.set('visible', !object.visible)
    canvasRef.current?.requestRenderAll()
    refreshLayers()
    saveSnapshot()
  }

  const getObjectId = (object: fabric.Object) => {
    const current = objectIdsRef.current.get(object)
    if (current) return current
    const next = nextObjectIdRef.current++
    objectIdsRef.current.set(object, next)
    return next
  }

  const setCanvasBackground = (color: string) => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.backgroundColor = color === 'transparent' ? '' : color
    if (color !== 'transparent') setBackgroundColor(color)
    canvas.requestRenderAll()
    saveSnapshot()
    setStatus(
      color === 'transparent'
        ? tx('背景已設為透明', 'Background set to transparent')
        : tx('背景顏色已更新', 'Background color updated'),
    )
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas || canvas.getObjects().length === 0) return
    if (!window.confirm(tx('確定要移除畫布上的所有圖片嗎？', 'Remove all images from the canvas?'))) return
    canvas.getObjects().forEach((object) => canvas.remove(object))
    canvas.discardActiveObject()
    canvas.requestRenderAll()
    refreshLayers()
    syncSelection()
    saveSnapshot()
    setStatus(tx('畫布已清空', 'Canvas cleared'))
  }

  const exportImage = (format: 'png' | 'jpeg') => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.discardActiveObject()
    canvas.requestRenderAll()
    const multiplier = canvasSizeRef.current.width / canvas.getWidth()
    const dataUrl = canvas.toDataURL({ format, quality: 0.95, multiplier })
    const link = document.createElement('a')
    link.download = `nomad-collage.${format === 'jpeg' ? 'jpg' : 'png'}`
    link.href = dataUrl
    link.click()
    setStatus(tx(`${format.toUpperCase()} 已匯出`, `${format.toUpperCase()} exported`))
  }

  const selectedIsImage = selectedObject instanceof fabric.FabricImage

  return (
    <section className={styles.editor} aria-label={tx('Collage 圖片編輯器', 'Collage image editor')}>
      <header className={styles.topbar}>
        <div className={styles.brandBlock}>
          <span className={styles.eyebrow}>IMAGE WORKSPACE</span>
          <h1>Collage Studio</h1>
        </div>
        <div className={styles.topbarActions}>
          <button type="button" className={styles.secondaryButton} disabled={!canUndo} onClick={undo}>
            <ToolIcon name="undo-variant" />
            {tx('復原', 'Undo')}
          </button>
          <button type="button" className={styles.secondaryButton} disabled={!canRedo} onClick={redo}>
            <ToolIcon name="redo-variant" />
            {tx('重做', 'Redo')}
          </button>
          <button type="button" className={styles.exportButton} onClick={() => exportImage('png')}>
            <ToolIcon name="download" />
            {tx('匯出 PNG', 'Export PNG')}
          </button>
        </div>
      </header>

      <div className={styles.editorBody}>
        <aside className={styles.toolRail} aria-label={tx('Collage 版型工具', 'Collage tools')}>
          <button type="button" className={styles.railButton} onClick={() => setLibraryOpen(true)}>
            <ToolIcon name="image-plus-outline" />
            <span>{tx('作品庫', 'Library')}</span>
          </button>
          <button type="button" className={styles.railButton} onClick={() => arrangeImages('grid')}>
            <ToolIcon name="view-grid-outline" />
            <span>{tx('網格', 'Grid')}</span>
          </button>
          <button type="button" className={styles.railButton} onClick={() => arrangeImages('strip')}>
            <ToolIcon name="view-week-outline" />
            <span>{tx('橫排', 'Strip')}</span>
          </button>
          <button type="button" className={styles.railButton} onClick={() => arrangeImages('scatter')}>
            <ToolIcon name="cards-outline" />
            <span>{tx('自由', 'Freeform')}</span>
          </button>
          <div className={styles.railSpacer} />
          <button
            type="button"
            className={styles.railButton}
            disabled={!selectedObject}
            onClick={() => void duplicateSelected()}
          >
            <ToolIcon name="content-copy" />
            <span>{tx('複製', 'Duplicate')}</span>
          </button>
          <button
            type="button"
            className={`${styles.railButton} ${styles.dangerButton}`}
            disabled={!selectedObject}
            onClick={removeSelected}
          >
            <ToolIcon name="trash-can-outline" />
            <span>{tx('刪除', 'Delete')}</span>
          </button>
        </aside>

        <main className={styles.workspace} ref={workspaceRef}>
          <div className={styles.canvasStage}>
            <canvas ref={canvasElementRef} aria-label="可拖曳圖片的 collage 畫布" />
            {layers.length === 0 && (
              <div className={styles.emptyState}>
                <span aria-hidden="true" className={`${styles.emptyIcon} i-mdi-image-multiple-outline`} />
                <strong>{tx('從作品庫開始拼貼', 'Start with artwork from the library')}</strong>
                <p>
                  {tx(
                    '選取 Nomad Sketching 的作品，再自由移動、縮放與裁切。',
                    'Choose Nomad Sketching artwork, then move, scale, and crop it.',
                  )}
                </p>
                <button type="button" onClick={() => setLibraryOpen(true)}>
                  {tx('選擇作品', 'Choose artwork')}
                </button>
              </div>
            )}
          </div>
          <div className={styles.workspaceStatus}>
            <span>
              {canvasSize.width} × {canvasSize.height}px
            </span>
            <span>{zoom}%</span>
            <span aria-live="polite">{status}</span>
          </div>
        </main>

        <aside className={styles.inspector} aria-label={tx('圖片屬性與圖層', 'Image properties and layers')}>
          <div className={styles.panelSection}>
            <div className={styles.sectionHeading}>
              <h2>{tx('畫布', 'Canvas')}</h2>
            </div>
            <label className={styles.fieldLabel} htmlFor="canvas-size">
              {tx('尺寸', 'Size')}
            </label>
            <select
              id="canvas-size"
              className={styles.select}
              value={CANVAS_PRESETS.findIndex(
                (preset) => preset.width === canvasSize.width && preset.height === canvasSize.height,
              )}
              onChange={(event) => changeCanvasSize(Number(event.target.value))}
            >
              {CANVAS_PRESETS.map((preset, index) => (
                <option key={preset.label} value={index}>
                  {preset.label}
                </option>
              ))}
            </select>
            <div className={styles.backgroundRow}>
              <label className={styles.fieldLabel} htmlFor="background-color">
                {tx('背景', 'Background')}
              </label>
              <input
                id="background-color"
                type="color"
                value={backgroundColor}
                onChange={(event) => {
                  setBackgroundColor(event.target.value)
                  setCanvasBackground(event.target.value)
                }}
                aria-label={tx('背景顏色', 'Background color')}
              />
              <button type="button" className={styles.textButton} onClick={() => setCanvasBackground('transparent')}>
                {tx('透明', 'Transparent')}
              </button>
            </div>
          </div>

          <div className={styles.panelSection}>
            <div className={styles.sectionHeading}>
              <h2>{tx('圖片', 'Image')}</h2>
              <span>{selectedObject ? tx('已選取', 'Selected') : tx('未選取', 'Not selected')}</span>
            </div>
            {!selectedObject ? (
              <p className={styles.mutedText}>
                {tx(
                  '在畫布或圖層中選取一張圖片，即可調整屬性。',
                  'Select an image on the canvas or in Layers to edit its properties.',
                )}
              </p>
            ) : (
              <>
                <label className={styles.rangeLabel} htmlFor="image-opacity">
                  <span>{tx('透明度', 'Opacity')}</span>
                  <output>{opacity}%</output>
                </label>
                <input
                  id="image-opacity"
                  className={styles.range}
                  type="range"
                  min="10"
                  max="100"
                  value={opacity}
                  onChange={(event) => updateSelectedProperty('opacity', Number(event.target.value))}
                  onPointerUp={saveSnapshot}
                />
                <label className={styles.rangeLabel} htmlFor="image-rotation">
                  <span>{tx('旋轉', 'Rotation')}</span>
                  <output>{rotation}°</output>
                </label>
                <input
                  id="image-rotation"
                  className={styles.range}
                  type="range"
                  min="-180"
                  max="180"
                  value={rotation}
                  onChange={(event) => updateSelectedProperty('angle', Number(event.target.value))}
                  onPointerUp={saveSnapshot}
                />
                <div className={styles.buttonGrid}>
                  <button type="button" onClick={() => moveLayer('up')}>
                    <ToolIcon name="arrange-bring-forward" />
                    {tx('往上', 'Forward')}
                  </button>
                  <button type="button" onClick={() => moveLayer('down')}>
                    <ToolIcon name="arrange-send-backward" />
                    {tx('往下', 'Backward')}
                  </button>
                </div>
              </>
            )}
          </div>

          <div className={styles.panelSection}>
            <div className={styles.sectionHeading}>
              <h2>{tx('裁切', 'Crop')}</h2>
            </div>
            {!selectedIsImage ? (
              <p className={styles.mutedText}>
                {tx('選取圖片後，用四個方向精確裁切。', 'Select an image, then crop precisely from each edge.')}
              </p>
            ) : (
              <>
                <button
                  type="button"
                  className={`${styles.cropModeButton} ${cropMode ? styles.cropModeActive : ''}`}
                  aria-pressed={cropMode}
                  onClick={() => {
                    if (cropMode) {
                      cancelCrop()
                    } else {
                      if (!(selectedObject instanceof fabric.FabricImage)) return
                      lockedCropImageRef.current = selectedObject
                      selectedObject.set({ selectable: false, evented: false })
                      canvasRef.current?.requestRenderAll()
                      setCropMode(true)
                      setStatus(tx('圖片已鎖定，拖曳畫出裁切框', 'Image locked. Drag to draw a crop frame.'))
                    }
                  }}
                >
                  {cropMode ? tx('取消框選', 'Cancel crop') : tx('在圖片上框選裁切', 'Draw crop frame')}
                </button>
                {cropMode && (
                  <p className={styles.mutedText}>
                    {tx(
                      '拖曳框出範圍，再移動或調整控制點；按 Enter 或「套用裁切」確認。',
                      'Draw a frame, move or resize it, then press Enter or Apply Crop.',
                    )}
                  </p>
                )}
                {(['top', 'right', 'bottom', 'left'] as const).map((edge) => (
                  <div className={styles.cropRow} key={edge}>
                    <label htmlFor={`crop-${edge}`}>{{ top: '上', right: '右', bottom: '下', left: '左' }[edge]}</label>
                    <input
                      id={`crop-${edge}`}
                      className={styles.range}
                      type="range"
                      min="0"
                      max="80"
                      value={crop[edge]}
                      onChange={(event) => setCrop((current) => ({ ...current, [edge]: Number(event.target.value) }))}
                    />
                    <output>{crop[edge]}%</output>
                  </div>
                ))}
                <div className={styles.buttonGrid}>
                  <button type="button" onClick={applyCrop}>
                    {tx('套用裁切', 'Apply crop')}
                  </button>
                  <button type="button" onClick={pendingCropRectRef.current ? cancelCrop : resetCrop}>
                    {pendingCropRectRef.current ? tx('取消', 'Cancel') : tx('還原', 'Reset')}
                  </button>
                </div>
              </>
            )}
          </div>

          <div className={`${styles.panelSection} ${styles.layersSection}`}>
            <div className={styles.sectionHeading}>
              <h2>{tx('圖層', 'Layers')}</h2>
              <span>{layers.length}</span>
            </div>
            <div className={styles.layerList}>
              {layers.length === 0 && <p className={styles.mutedText}>{tx('還沒有圖層', 'No layers yet')}</p>}
              {layers.map((object, index) => (
                <button
                  type="button"
                  key={getObjectId(object)}
                  className={`${styles.layerItem} ${object === selectedObject ? styles.layerItemActive : ''}`}
                  onClick={() => selectLayer(object)}
                  aria-pressed={object === selectedObject}
                >
                  <span aria-hidden="true" className={`${styles.layerIcon} i-mdi-image-outline`} />
                  <span>{objectNamesRef.current.get(object) || `圖片 ${layers.length - index}`}</span>
                  <span className={styles.layerVisibility}>
                    {object.visible ? tx('可視', 'Visible') : tx('不可視', 'Hidden')}
                  </span>
                  <span
                    role="button"
                    tabIndex={0}
                    aria-label={object.visible ? tx('隱藏圖層', 'Hide layer') : tx('顯示圖層', 'Show layer')}
                    className={`${styles.visibilityToggle} i-mdi-${object.visible ? 'eye-outline' : 'eye-off-outline'}`}
                    onClick={(event) => {
                      event.stopPropagation()
                      toggleLayerVisibility(object)
                    }}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        event.stopPropagation()
                        toggleLayerVisibility(object)
                      }
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className={styles.inspectorFooter}>
            <button type="button" onClick={() => exportImage('jpeg')}>
              {tx('匯出 JPG', 'Export JPG')}
            </button>
            <button type="button" className={styles.clearButton} disabled={layers.length === 0} onClick={clearCanvas}>
              {tx('清空畫布', 'Clear canvas')}
            </button>
          </div>
        </aside>
      </div>

      {libraryOpen && (
        <div
          className={styles.libraryScrim}
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setLibraryOpen(false)
          }}
        >
          <section className={styles.libraryDialog} role="dialog" aria-modal="true" aria-labelledby="library-title">
            <div className={styles.libraryHeader}>
              <div>
                <span className={styles.eyebrow}>NOMAD SKETCHING</span>
                <h2 id="library-title">{tx('選擇作品', 'Choose artwork')}</h2>
              </div>
              <button
                type="button"
                aria-label={tx('關閉作品庫', 'Close library')}
                onClick={() => setLibraryOpen(false)}
              >
                ×
              </button>
            </div>
            {artworks.length === 0 ? (
              <p className={styles.mutedText}>{tx('目前沒有可使用的作品圖片。', 'No artwork images are available.')}</p>
            ) : (
              <div className={styles.libraryGrid}>
                {artworks
                  .filter((artwork) => artwork.mainImage?.src)
                  .map((artwork) => (
                    <button
                      type="button"
                      key={artwork.id}
                      className={styles.libraryCard}
                      onClick={() => void addArtwork(artwork)}
                    >
                      <img src={artwork.mainImage?.src || ''} alt="" />
                      <span>{getArtworkName(artwork, locale)}</span>
                    </button>
                  ))}
              </div>
            )}
          </section>
        </div>
      )}
    </section>
  )
}

export default CollageEditor
