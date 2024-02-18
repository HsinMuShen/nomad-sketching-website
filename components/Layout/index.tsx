import { ReactNode } from 'react'
import Link from 'next/link'
import styles from './index.module.css'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.container}>
      {children}
      <h2>
        <Link href="/">Back to home</Link>
      </h2>
    </div>
  )
}
