import '@unocss/reset/tailwind.css'
import 'uno.css'
import type { AppProps } from 'next/app'
import 'src/styles/global.css'
import 'src/styles/VerticalCarousel.css'

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
