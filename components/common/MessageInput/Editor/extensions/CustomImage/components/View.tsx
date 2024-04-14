import { NodeViewWrapper } from '@tiptap/react'
import { useEffect, useState, useCallback } from 'react'
import { Icon } from '@ui'
import { ATTACHMENT_STATE } from 'components/common/MessageInput/constants'
import LoadingState from 'components/common/MessageInput/Editor/components/LoadingState'

type Props = {
  node: {
    attrs: {
      src: string
      name: string
      file: File
      sourceAbleToDelete: boolean
    }
  }
  extension: {
    options: {
      onUpload: (file: File) => Promise<{ url: string }>
      onDelete: ({ url, sourceAbleToDelete }: { url: string; sourceAbleToDelete?: boolean; name: string }) => void
    }
  }
  deleteNode: () => void
  updateAttributes: (payload: Record<string, unknown>) => void
}

const View = (props: Props) => {
  const { node, updateAttributes, extension, deleteNode } = props
  const { src, name, file, sourceAbleToDelete } = node.attrs
  const { onUpload, onDelete } = extension.options
  const [base64Image, setBase64Image] = useState<string>('')
  const [state, setState] = useState<string>(ATTACHMENT_STATE.INIT)

  const borderColor =
    state === ATTACHMENT_STATE.FAILED ? 'border-primary-500 active:border-primary-800' : 'border-neutral-200'

  const isProcessing = state === ATTACHMENT_STATE.INIT

  useEffect(() => {
    if (!file) return
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      setBase64Image(reader.result as string)
    }
  }, [file])

  const handleUpload = useCallback(
    async (file: File) => {
      try {
        const { url } = await onUpload(file)
        updateAttributes({ src: url })
        setState(ATTACHMENT_STATE.FINISHED)
      } catch (error) {
        setState(ATTACHMENT_STATE.FAILED)
      }
    },
    [onUpload, updateAttributes],
  )

  const handleDelete = useCallback(() => {
    if (state === ATTACHMENT_STATE.INIT) return
    if (state === ATTACHMENT_STATE.FAILED) return deleteNode()

    onDelete({ url: src, sourceAbleToDelete, name: name })
    deleteNode()
  }, [onDelete, src, state, deleteNode, sourceAbleToDelete, name])

  useEffect(() => {
    if (!file) return
    handleUpload(file)
  }, [file, handleUpload])

  useEffect(() => {
    if (!src) return
    setState(ATTACHMENT_STATE.FINISHED)
  }, [src])

  return (
    <NodeViewWrapper>
      <div
        className={`relative flex items-center ma-2 border-1 border-rounded border-solid ${borderColor} text-neutral-700 hover:text-primary-600 active:text-primary-800 active:bg-neutral-200 cursor-pointer`}
        data-drag-handle
      >
        {isProcessing ? (
          <LoadingState />
        ) : (
          <img className="block h-full w-full object-cover" src={base64Image || src} alt={name} />
        )}
        <div
          role="button"
          title="Delete"
          className="border-round absolute right-0 top-0 flex translate-x-1/2 translate-y--1/2 cursor-pointer text-neutral-700 hover:text-primary-600"
          onClick={handleDelete}
        >
          <Icon icon="i-mdi-close-circle" size="xl" className="block" />
        </div>
      </div>
    </NodeViewWrapper>
  )
}

export default View
