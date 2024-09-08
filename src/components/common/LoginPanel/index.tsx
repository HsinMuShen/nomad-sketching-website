import { useState } from 'react'
import { useRouter } from 'next/router'
import { Dialog, Button, Input } from '@ui'
import { useBoundStore } from '@stores'
import { signIn } from 'libs/auth'

type LoginPanelProps = {
  closePanel: () => void
}

const LoginPanel = ({ closePanel }: LoginPanelProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const setUser = useBoundStore((state) => state.setUser)

  const router = useRouter()

  const title = 'Login to the admin page'

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
            <div className="text-4 font-bold mr-6 min-w-20">Email</div>
            <Input className="w-full" variant="underlined" value={email} onValueChange={setEmail} />
          </div>
          <div className="flex items-center">
            <div className="text-4 font-bold mr-6 min-w-20">Password</div>
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
  return (
    <div className="flex justify-center w-full">
      <Button variant="plain" color="secondary" disabled={!isSignInButtonEnabled} onClick={onSignInButtonClick}>
        Login
      </Button>
    </div>
  )
}
