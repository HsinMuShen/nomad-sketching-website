import { GoogleTagManager } from '@next/third-parties/google'
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
      <GoogleTagManager gtmId="GTM-P6TKNQ87" />
      <div className="max-w-80vw mt-18 mx-auto">{children}</div>
    </div>
  )
}
