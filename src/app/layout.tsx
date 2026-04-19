import { inter } from "@/lib/fonts";
import "./globals.css";
import ReduxStoreProvider from "@/lib/redux/ReduxStoreProvider";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className}`}
      >
        <ReduxStoreProvider>
          {children}
        </ReduxStoreProvider>
      </body>
    </html>
  )
}