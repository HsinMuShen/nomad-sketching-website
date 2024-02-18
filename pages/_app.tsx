import '@unocss/reset/tailwind.css'
import 'uno.css'
import type { AppProps } from 'next/app'
// import 'styles/global.css'

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
