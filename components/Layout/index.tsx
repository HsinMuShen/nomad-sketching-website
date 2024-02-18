import { ReactNode } from 'react'
import styles from './index.module.css'

export default function Layout({ children }: { children: ReactNode }) {
  return <div className={styles.container}>{children}</div>
}
