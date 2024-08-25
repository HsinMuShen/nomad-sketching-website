import { Dialog } from '@ui'

type LoginPanelProps = {
  closePanel: () => void
}

const LoginPanel = ({ closePanel }: LoginPanelProps) => {
  return (
    <div>
      <Dialog title="Login" size="sm" footer={<Footer />} onClose={closePanel}>
        <div>Content</div>
      </Dialog>
    </div>
  )
}

export default LoginPanel

const Footer = () => {
  return <div>Content</div>
}
