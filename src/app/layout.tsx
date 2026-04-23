import { inter } from "@/lib/fonts";
import "./globals.css";
import { siteMetadata, siteViewport } from "@/metadata";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = siteMetadata
export const viewport: Viewport = siteViewport



export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {

	return (
		<html lang="en">
			<head>
				<link rel="icon" href="/favicon.ico" sizes="any" />
				<link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
				<link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
				<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
			</head>
			<body
				className={`${inter.className}`}
			>
				{children}
			</body>
		</html>
	)
}