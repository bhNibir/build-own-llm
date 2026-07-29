import { RootProvider } from 'fumadocs-ui/provider/next';
import 'katex/dist/katex.min.css';
import './global.css';
import { Inter, Noto_Sans_Bengali, JetBrains_Mono } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const notoBengali = Noto_Sans_Bengali({
  subsets: ['bengali', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-bn',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="bn"
      className={`${inter.variable} ${notoBengali.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col font-bn antialiased">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
