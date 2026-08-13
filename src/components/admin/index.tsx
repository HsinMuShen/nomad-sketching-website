import { useRouter } from 'next/router'
import { Button } from 'components/common/ui'
import { useI18n } from 'libs/i18n'
import Articles from './components/Articles'

const Admin = () => {
  const router = useRouter()
  const { t } = useI18n()

  const onCreateClick = async () => {
    router.push('/admin/create')
  }

  const onDiaryClick = async () => {
    router.push('/admin/diary')
  }

  return (
    <div>
      <div className="flex justify-between items-center border-b-1 mb-4">
        <div className="text-5 font-bold">{t('admin.artworksTitle')}</div>
        <div>
          <Button className="mb-2 mr-2" color="secondary" variant="plain" onClick={onDiaryClick}>
            {t('admin.diary')}
          </Button>
          <Button className="mb-2" color="secondary" variant="plain" onClick={onCreateClick}>
            {t('admin.createArtwork')}
          </Button>
        </div>
      </div>
      <Articles />
    </div>
  )
}

export default Admin
