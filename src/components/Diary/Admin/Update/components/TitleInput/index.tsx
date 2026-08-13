import { Input } from 'components/common/ui'
import { useI18n } from 'libs/i18n'

type TitleInputProps = {
  title: string
  setTitle: (title: string) => void
}

const TitleInput = ({ title, setTitle }: TitleInputProps) => {
  const { t } = useI18n()

  return (
    <div>
      <div className="font-bold mb-2">{t('admin.title')}</div>
      <Input value={title} onValueChange={setTitle} />
    </div>
  )
}

export default TitleInput
