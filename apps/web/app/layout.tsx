import type { Metadata } from "next";
import { AuthProvider } from "../contexts/AuthContext";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Deal Kroo - Dealer-to-Dealer Property Platform",
    template: "%s | Deal Kroo",
  },
  description: "Connect with real estate dealers, publish property listings, and discover available properties. The dealer-to-dealer platform for property discovery and networking.",
  keywords: ["real estate", "property listings", "dealers", "property platform", "Deal Kroo", "property discovery", "real estate dealers"],
  authors: [{ name: "Deal Kroo" }],
  creator: "Deal Kroo",
  publisher: "Deal Kroo",
  applicationName: "Deal Kroo",
  metadataBase: new URL("https://dealkroo.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://dealkroo.com",
    title: "Deal Kroo - Dealer-to-Dealer Property Platform",
    description: "Connect with real estate dealers, publish property listings, and discover available properties. The dealer-to-dealer platform for property discovery.",
    siteName: "Deal Kroo",
  },
  twitter: {
    card: "summary_large_image",
    title: "Deal Kroo - Dealer-to-Dealer Property Platform",
    description: "Connect with real estate dealers, publish property listings, and discover available properties.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: [
      { url: "/favicon.png", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#111111" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Deal Kroo" />
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
