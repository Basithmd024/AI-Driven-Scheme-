export const metadata = {
  title: 'AI Scheme Matcher | Empowering Marginalized Entrepreneurs',
  description: 'AI-driven scheme matching and eligibility engine for marginalized entrepreneurs.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
