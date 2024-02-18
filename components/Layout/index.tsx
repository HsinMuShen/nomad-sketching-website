import { ReactNode } from 'react'
import Link from 'next/link'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-80vw px-4 my-12 mx-auto">
      {children}
      <div>
        <Link href="/">Back to home</Link>
      </div>
    </div>
  )
}
