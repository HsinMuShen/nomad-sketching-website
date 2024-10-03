import { Input } from 'components/common/ui'

type TitleInputProps = {
  title: string
  setTitle: (title: string) => void
}

const TitleInput = ({ title, setTitle }: TitleInputProps) => {
  return (
    <div>
      <div className="font-bold mb-2">Title</div>
      <Input value={title} onValueChange={setTitle} />
    </div>
  )
}

export default TitleInput
