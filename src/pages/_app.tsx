import '@unocss/reset/tailwind.css'
import 'uno.css'
import type { AppProps } from 'next/app'
import 'src/styles/global.css'
import 'src/styles/VerticalCarousel.css'
import Script from 'next/script'

export default function App({ Component, pageProps }: AppProps) {
  const GTM_ID = 'GTM-P6TKNQ87'

  return (
    <>
      <Script id="gtm" strategy="afterInteractive">
        {`
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${GTM_ID}');
      `}
      </Script>
      <Component {...pageProps} />
    </>
  )
}
