import type { Metadata, Viewport } from "next";
import "../styles/global.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0e1a" },
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://samarthya-setu.gov.in"),
  title: {
    default: "Samarthya Setu | SC Concessional Channel Finance & AI Scheme Matching",
    template: "%s | Samarthya Setu",
  },
  description: "AI-driven platform empowering Scheduled Caste beneficiaries across India with instant scheme matching, 4.0%–8.0% concessional EMI simulations, and geo-spatial routing to 100+ Channel Partners.",
  keywords: [
    "Samarthya Setu",
    "NSFDC",
    "SC Channel Finance",
    "Concessional Credit Schemes",
    "Scheduled Caste Welfare",
    "Mahila Samriddhi",
    "State Channelizing Agencies",
    "EMI Calculator",
    "Moratorium Simulator",
  ],
  authors: [{ name: "National Scheduled Castes Finance & Development Corporation" }],
  creator: "Apex Concessional Finance Network",
  publisher: "Ministry of Social Justice and Empowerment",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
    ],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://samarthya-setu.gov.in",
    siteName: "Samarthya Setu",
    title: "Samarthya Setu — AI-Powered SC Concessional Finance",
    description: "Match with concessional credit schemes from NSFDC, simulate repayment with interest subsidies, and locate verified channel partners across India.",
    images: [
      {
        url: "/favicon.svg",
        width: 100,
        height: 100,
        alt: "Samarthya Setu Emblem",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Samarthya Setu | SC Concessional Channel Finance",
    description: "Statutory income ceiling compliance, 4-8% concessional interest rates, and direct SCA partner routing.",
    images: ["/favicon.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  );
}
