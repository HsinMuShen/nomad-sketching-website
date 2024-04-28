import { ReactNode } from 'react'
import Header from './components/Header'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full">
      <Header isAdmin={true} />
      <div className="max-w-80vw px-4 my-18 mx-auto">{children}</div>
    </div>
  )
}
