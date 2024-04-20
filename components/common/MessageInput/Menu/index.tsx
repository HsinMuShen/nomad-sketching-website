import type { Editor } from '@tiptap/core'
import type { Level } from '@tiptap/extension-heading'
import { IconButton } from '@ui'

const Menu = ({ editor }: { editor: Editor | null }) => {
  const getHeaderClass = (level: Level) => {
    return editor?.isActive('heading', { level }) ? 'border-neutral-800' : ''
  }
  const getActiveClass = (styling: string) => {
    return editor?.isActive(styling) ? 'border-neutral-800' : ''
  }

  const onHLevelClick = (level: Level) => {
    editor?.chain().focus().toggleHeading({ level }).run()
  }

  const onBoldClick = () => {
    editor?.chain().focus().toggleBold().run()
  }

  const onItalicClick = () => {
    console.log('italic', editor?.isActive('bold'))
    editor?.chain().focus().toggleItalic().run()
  }

  const onStrikeClick = () => {
    editor?.chain().focus().toggleStrike().run()
  }

  const onUnderlineClick = () => {
    editor?.chain().focus().toggleUnderline().run()
  }

  const onCodeClick = () => {
    editor?.chain().focus().toggleCode().run()
  }

  const onBulletListClick = () => {
    editor?.chain().focus().toggleBulletList().run()
  }

  const onOrderedListClick = () => {
    editor?.chain().focus().toggleOrderedList().run()
  }

  return (
    <div className="flex gap-1 my-1">
      <IconButton
        icon="i-mdi-format-header-1"
        color="secondary"
        variant="plain"
        hasPadding={false}
        onClick={() => onHLevelClick(1)}
        className={getHeaderClass(1)}
      />
      <IconButton
        icon="i-mdi-format-header-2"
        color="secondary"
        variant="plain"
        hasPadding={false}
        onClick={() => onHLevelClick(2)}
        className={getHeaderClass(2)}
      />
      <IconButton
        icon="i-mdi-format-header-3"
        color="secondary"
        variant="plain"
        hasPadding={false}
        onClick={() => onHLevelClick(3)}
        className={getHeaderClass(3)}
      />
      <IconButton
        icon="i-mdi-format-bold"
        color="secondary"
        variant="plain"
        hasPadding={false}
        onClick={onBoldClick}
        className={`${getActiveClass('bold')}`}
      />
      <IconButton
        icon="i-mdi-format-italic"
        color="secondary"
        variant="plain"
        hasPadding={false}
        onClick={onItalicClick}
        className={getActiveClass('italic')}
      />
      <IconButton
        icon="i-mdi-format-strikethrough"
        color="secondary"
        variant="plain"
        hasPadding={false}
        onClick={onStrikeClick}
        className={getActiveClass('strike')}
      />
      <IconButton
        icon="i-mdi-format-underline"
        color="secondary"
        variant="plain"
        hasPadding={false}
        onClick={onUnderlineClick}
        className={getActiveClass('underline')}
      />
      <IconButton
        icon="i-mdi-code-tags"
        color="secondary"
        variant="plain"
        hasPadding={false}
        onClick={onCodeClick}
        className={getActiveClass('code')}
      />
      <IconButton
        icon="i-mdi-format-list-bulleted"
        color="secondary"
        variant="plain"
        hasPadding={false}
        onClick={onBulletListClick}
        className={getActiveClass('bulletList')}
      />
      <IconButton
        icon="i-mdi-format-list-numbered"
        color="secondary"
        variant="plain"
        hasPadding={false}
        onClick={onOrderedListClick}
        className={getActiveClass('orderedList')}
      />
    </div>
  )
}

export default Menu
