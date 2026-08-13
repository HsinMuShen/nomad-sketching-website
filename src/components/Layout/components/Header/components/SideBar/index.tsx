import Link from 'next/link'
import { Icon } from 'src/components/common/ui'
import { useI18n } from 'libs/i18n'
import { SIDEBAR_LINKS } from 'components/Layout/components/Header/constants'

type HeaderSidebarProps = {
  isSideBar: boolean
  setIsSideBar: (value: boolean) => void
  isLogin: boolean
  openLoginPanel: () => void
}

const Sidebar = ({ isSideBar, setIsSideBar, isLogin, openLoginPanel }: HeaderSidebarProps) => {
  const sideBarPosition = isSideBar ? 'right-0' : '-right-200'
  const sidebarTextClass = 'mx-5 my-1 text-white'
  const { locale, t, toggleLocale } = useI18n()

  return (
    <div
      className={`fixed top-0 h-screen w-50 bg-black bg-opacity-60 transition-right duration-800 ${sideBarPosition}`}
    >
      <p className="absolute top-4 left-5 text-white cursor-pointer" onClick={() => setIsSideBar(false)}>
        <Icon icon="i-mdi-close" size="xl" />
      </p>
      <div className="mt-20 flex flex-col">
        {SIDEBAR_LINKS.map((link) => (
          <Link key={link.labelKey} href={link.href} className={`${sidebarTextClass}`}>
            {t(link.labelKey)}
          </Link>
        ))}
        <button type="button" className={`${sidebarTextClass} text-left`} onClick={toggleLocale}>
          {locale === 'zh' ? t('header.switchToEnglish') : t('header.switchToChinese')}
        </button>
        {isLogin ? (
          <Link href="/admin" className={`${sidebarTextClass}`}>
            {t('common.admin')}
          </Link>
        ) : (
          <div
            className={`cursor-pointer ${sidebarTextClass}`}
            onClick={() => {
              openLoginPanel()
            }}
          >
            {t('common.login')}
          </div>
        )}
      </div>
    </div>
  )
}

export default Sidebar
