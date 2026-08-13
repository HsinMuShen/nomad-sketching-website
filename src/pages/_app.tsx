import '@unocss/reset/tailwind.css'
import 'uno.css'
import 'leaflet/dist/leaflet.css'
import type { AppProps } from 'next/app'
import 'src/styles/global.css'
import 'src/styles/VerticalCarousel.css'
import { I18nProvider } from 'libs/i18n'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <I18nProvider>
      <Component {...pageProps} />
    </I18nProvider>
  )
}
