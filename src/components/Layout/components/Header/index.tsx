import { useState } from 'react'
import Link from 'next/link'
import { Icon } from 'src/components/common/ui'
import { NAV_LINKS, SIDEBAR_LINKS } from './constants'

type HeaderProps = {
  isAdmin: boolean
}

const Header = ({ isAdmin }: HeaderProps) => {
  const [isSideBar, setIsSideBar] = useState(false)
  const desktopClass = 'mx-5 text-gray-800 hover:text-gray-400 hidden md:block'

  return (
    <div className="fixed w-full h-15 bg-white flex justify-between items-center border-b-2 top-0 z-10">
      <div className="flex items-center">
        <Link href="/" className="flex items-center mx-5 text-gray-800 hover:text-gray-400 font-800">
          <Icon className="mr-2" icon="i-mdi-grease-pencil" size="xl" />
          {'Nomad Sketching'}
        </Link>
        {NAV_LINKS.map((link) => (
          <Link key={link.label} href={link.href} className={desktopClass}>
            {link.label}
          </Link>
        ))}
      </div>
      {isAdmin ? (
        <Link href="/admin" className={`${desktopClass}`}>
          <Icon icon="i-mdi-account-tie-hat" size="3xl" />
        </Link>
      ) : (
        <Link href="/login" className={`${desktopClass}`}>
          <Icon icon="i-mdi-login" size="3xl" />
        </Link>
      )}
      <div className={`flex items-center md:hidden`}>
        <p className="mx-5 text-gray-800 cursor-pointer hover:text-gray-600" onClick={() => setIsSideBar(true)}>
          <Icon icon="i-mdi-menu" size="xl" />
        </p>
      </div>
      <HeaderSidebar isSideBar={isSideBar} setIsSideBar={setIsSideBar} />
    </div>
  )
}

export default Header

type HeaderSidebarProps = {
  isSideBar: boolean
  setIsSideBar: (value: boolean) => void
}

const HeaderSidebar = ({ isSideBar, setIsSideBar }: HeaderSidebarProps) => {
  const sideBarPosition = isSideBar ? 'right-0' : '-right-200'

  return (
    <div
      className={`fixed top-0 h-screen w-50 bg-black bg-opacity-60 transition-right duration-800 ${sideBarPosition}`}
    >
      <p className="absolute top-4 left-5 text-white cursor-pointer" onClick={() => setIsSideBar(false)}>
        <Icon icon="i-mdi-close" size="xl" />
      </p>
      <div className="mt-20 flex flex-col">
        {SIDEBAR_LINKS.map((link) => (
          <Link key={link.label} href={link.href} className="mx-5 my-1 text-white">
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
