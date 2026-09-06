import type { Metadata, Viewport } from "next";
import "../styles/global.css";
import { LanguageProvider } from "../lib/LanguageContext";

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
    default: "Samarthya Setu | India-Wide Government Scheme Matching & Concessional Credit",
    template: "%s | Samarthya Setu",
  },
  description: "India-wide AI platform empowering entrepreneurs across all categories (General, OBC, SC, ST, Minorities, Women) with instant scheme matching across PMEGP, MUDRA, Stand-Up India, PM Vishwakarma, PM SVANidhi, NSFDC, NSTFDC, NBCFDC, and NMDFC.",
  keywords: [
    "Samarthya Setu",
    "PMEGP",
    "PM MUDRA Yojana",
    "Stand-Up India",
    "PM Vishwakarma",
    "PM SVANidhi",
    "NSFDC",
    "NSTFDC",
    "NBCFDC",
    "NMDFC",
    "CGTMSE",
    "Government Schemes India",
    "Concessional Credit",
    "EMI Calculator",
  ],
  authors: [{ name: "Ministry of MSME & Ministry of Finance Channel Network" }],
  creator: "Apex Concessional Finance Network",
  publisher: "Government of India Multi-Portal Network",
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
    title: "Samarthya Setu — India-Wide Government Scheme & Credit Portal",
    description: "Match with credit schemes across PMEGP, Mudra, Stand-Up India, Vishwakarma, NSFDC and locate 100+ verified channel partners across India.",
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
    title: "Samarthya Setu | India-Wide Government Credit Network",
    description: "PMEGP, MUDRA, Stand-Up India, Vishwakarma, and concessional loans across all Indian states.",
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
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" defer></script>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.ico" />
      </head>
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
