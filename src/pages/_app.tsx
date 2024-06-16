import '@unocss/reset/tailwind.css'
import 'uno.css'
import type { AppProps } from 'next/app'
import 'src/styles/global.css'
import 'src/styles/VerticalCarousel.css'
import { GoogleTagManager } from '@next/third-parties/google'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <GoogleTagManager gtmId="GTM-P6TKNQ87" />
    </>
  )
}
