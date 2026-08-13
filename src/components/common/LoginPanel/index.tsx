import { useState } from 'react'
import { useRouter } from 'next/router'
import { Dialog, Button, Input } from '@ui'
import { useBoundStore } from '@stores'
import { signIn } from 'libs/auth'
import { useI18n } from 'libs/i18n'

type LoginPanelProps = {
  closePanel: () => void
}

const LoginPanel = ({ closePanel }: LoginPanelProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const setUser = useBoundStore((state) => state.setUser)
  const { t } = useI18n()

  const router = useRouter()

  const title = t('login.title')

  const isSignInButtonEnabled = Boolean(email && password)

  const onSignInButtonClick = async () => {
    try {
      const user = await signIn(email, password)
      setUser(user)
      closePanel()
      router.push('/admin')
    } catch (error) {
      console.error(error)
      alert((error as Error).message)
    }
  }

  const FooterComponent = (
    <Footer isSignInButtonEnabled={isSignInButtonEnabled} onSignInButtonClick={onSignInButtonClick} />
  )

  return (
    <div>
      <Dialog title={title} size="sm" footer={FooterComponent} onClose={closePanel}>
        <div className="py-4">
          <div className="flex items-center">
            <div className="text-4 font-bold mr-6 min-w-20">{t('common.email')}</div>
            <Input className="w-full" variant="underlined" value={email} onValueChange={setEmail} />
          </div>
          <div className="flex items-center">
            <div className="text-4 font-bold mr-6 min-w-20">{t('common.password')}</div>
            <Input
              className="w-full"
              variant="underlined"
              value={password}
              onValueChange={setPassword}
              type="password"
            />
          </div>
        </div>
      </Dialog>
    </div>
  )
}

export default LoginPanel

type FooterProps = {
  isSignInButtonEnabled: boolean
  onSignInButtonClick: () => void
}

const Footer = ({ isSignInButtonEnabled, onSignInButtonClick }: FooterProps) => {
  const { t } = useI18n()

  return (
    <div className="flex justify-center w-full">
      <Button variant="plain" color="secondary" disabled={!isSignInButtonEnabled} onClick={onSignInButtonClick}>
        {t('login.submit')}
      </Button>
    </div>
  )
}
