import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { sendGTMEvent } from '@next/third-parties/google'
import Link from 'next/link'
import { useBoundStore } from '@stores'
import { Icon } from '@ui'
import { checkIsAlreadyLogin } from 'libs/auth'
import LoginPanel from 'components/common/LoginPanel'
import Sidebar from './components/SideBar'
import { NAV_LINKS } from './constants'

type HeaderProps = {
  isAdminPage?: boolean
}

const Header = ({ isAdminPage }: HeaderProps) => {
  const [isSideBar, setIsSideBar] = useState(false)
  const [showLoginPanel, setShowLoginPanel] = useState(false)
  const { isLogin, setUser, hasInitialized, setHasInitialized } = useBoundStore((state) => ({
    isLogin: state.getIsLogin(),
    ...state,
  }))
  const router = useRouter()

  const desktopClass = 'h-full items-center px-5 text-gray-600 hover:text-gray-900 hidden md:flex hover:bg-neutral-100'

  const onLinkClick = (value: string) => {
    sendGTMEvent({
      event: 'header-click',
      value,
    })
  }

  const closeLoginPanel = () => {
    setShowLoginPanel(false)
  }

  const openLoginPanel = () => {
    setShowLoginPanel(true)
  }

  useEffect(() => {
    checkIsAlreadyLogin(setUser, setHasInitialized)
  }, [setUser, setHasInitialized])

  useEffect(() => {
    if (!hasInitialized) return
    if (!isAdminPage || isLogin) return
    router.push('/')
  }, [hasInitialized, isAdminPage, isLogin, router])

  return (
    <div className="fixed w-full h-15 bg-white flex justify-between items-center border-b-2 top-0 z-2">
      <div className="h-full flex items-center">
        <Link
          href="/"
          className="h-full flex items-center mx-5 text-gray-800 hover:text-gray-400 font-800"
          onClick={() => {
            onLinkClick('index')
          }}
        >
          <Icon className="mr-2" icon="i-mdi-grease-pencil" size="xl" />
          {'Nomad Sketching'}
        </Link>
        {NAV_LINKS.map((link) => (
          <Link key={link.label} href={link.href} className={desktopClass}>
            {link.label}
          </Link>
        ))}
      </div>
      <IconsArea isLogin={isLogin} openLoginPanel={openLoginPanel} />
      <div className={`flex items-center md:hidden`}>
        <p className="mx-5 text-gray-800 cursor-pointer hover:text-gray-600" onClick={() => setIsSideBar(true)}>
          <Icon icon="i-mdi-menu" size="xl" />
        </p>
      </div>
      <Sidebar isSideBar={isSideBar} setIsSideBar={setIsSideBar} isLogin={isLogin} openLoginPanel={openLoginPanel} />
      {showLoginPanel && <LoginPanel closePanel={closeLoginPanel} />}
    </div>
  )
}

export default Header

const IconsArea = ({ isLogin, openLoginPanel }: { isLogin: boolean; openLoginPanel: () => void }) => {
  const iconClass = 'mx-2 text-gray-800 hover:text-gray-400 hidden md:block'

  return (
    <div className="flex mx-3">
      <Link href="/about" className={`${iconClass}`}>
        <Icon icon="i-mdi-information" size="xl" />
      </Link>
      <Link href="/special-thanks" className={`${iconClass}`}>
        <Icon icon="i-mdi-heart" size="xl" />
      </Link>
      {isLogin ? (
        <Link href="/admin" className={`${iconClass}`}>
          <Icon icon="i-mdi-account-tie-hat" size="xl" />
        </Link>
      ) : (
        <div
          className={`cursor-pointer ${iconClass}`}
          onClick={() => {
            openLoginPanel()
          }}
        >
          <Icon icon="i-mdi-login-variant" size="xl" />
        </div>
      )}
    </div>
  )
}
