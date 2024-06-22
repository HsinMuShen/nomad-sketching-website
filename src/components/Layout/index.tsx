import { ReactNode } from 'react'
import Head from 'next/head'
import Header from './components/Header'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full">
      <Head>
        <title>Nomad Sketching</title>
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <Header />
      <div className="max-w-80vw mx-auto pt-20">{children}</div>
    </div>
  )
}
