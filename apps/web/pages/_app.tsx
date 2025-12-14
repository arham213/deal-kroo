import type { AppProps } from "next/app"
import Head from "next/head"
import { AuthProvider } from "../contexts/AuthContext"
import "../app/globals.css"

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#111111" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Deal Kroo" />
        <title>Deal Kroo - Dealer-to-Dealer Property Platform</title>
        <meta name="description" content="Connect with real estate dealers, publish property listings, and discover available properties. The dealer-to-dealer platform for property discovery." />
        <meta name="keywords" content="real estate, property listings, dealers, property platform, Deal Kroo, property discovery" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Deal Kroo - Dealer-to-Dealer Property Platform" />
        <meta property="og:description" content="Connect with real estate dealers, publish property listings, and discover available properties." />
        <meta property="og:site_name" content="Deal Kroo" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Deal Kroo - Dealer-to-Dealer Property Platform" />
        <meta name="twitter:description" content="Connect with real estate dealers, publish property listings, and discover available properties." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </Head>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </>
  )
}
