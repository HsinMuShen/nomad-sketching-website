import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { sendGTMEvent } from '@next/third-parties/google'
import Link from 'next/link'
import { useBoundStore } from '@stores'
import { Icon } from '@ui'
import { checkIsAlreadyLogin } from 'libs/auth'
import { useI18n } from 'libs/i18n'
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
  const { t } = useI18n()
  const router = useRouter()
  const isHomePage = router.pathname === '/'

  const desktopClass = `h-full items-center px-5 text-gray-700 hover:text-black hidden md:flex transition-colors ${
    isHomePage ? 'hover:bg-black/5' : 'hover:bg-neutral-100'
  }`

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
    <div
      className={`fixed top-0 z-[1000] flex h-15 w-full items-center justify-between ${
        isHomePage ? 'border-b border-black/10 bg-white/88 backdrop-blur-md' : 'border-b-2 bg-white'
      }`}
    >
      <div className="h-full flex items-center">
        <Link
          href="/"
          className={`mx-5 flex h-full items-center text-gray-900 transition-colors hover:text-gray-500 ${
            isHomePage ? 'text-4 font-700 tracking-[-0.025em]' : 'font-800'
          }`}
          onClick={() => {
            onLinkClick('index')
          }}
        >
          {!isHomePage && <Icon className="mr-2" icon="i-mdi-grease-pencil" size="xl" />}
          {t('common.brand')}
        </Link>
        {NAV_LINKS.map((link) => (
          <Link key={link.labelKey} href={link.href} className={desktopClass}>
            {t(link.labelKey)}
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
  const { locale, toggleLocale, t } = useI18n()

  return (
    <div className="flex mx-3">
      <button
        type="button"
        aria-label={t('header.language')}
        className="mx-2 text-sm font-bold text-gray-800 hover:text-gray-400 hidden md:block"
        onClick={toggleLocale}
      >
        {locale === 'zh' ? t('header.switchToEnglish') : t('header.switchToChinese')}
      </button>
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
