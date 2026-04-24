import { inter } from "@/lib/fonts";
import "./globals.css";
import { siteMetadata, siteViewport } from "@/metadata";
import type { Metadata, Viewport } from "next";
import ReduxStoreProvider from "@/lib/redux/ReduxStoreProvider"
import PopUpsRenderer from "@/components/modals/"
import { getServerAxios } from "@/lib/axios"
import { ADMIN_PROFILE_ENDPOINT } from "@/endpoints"
import AuthPersistor from "@/persistors/AuthPersistor"

export const metadata: Metadata = siteMetadata
export const viewport: Viewport = siteViewport

async function getLayoutData(): Promise<AuthUser | null> {
	try {
		const axiosInstance = await getServerAxios()
		const { data } = await axiosInstance.get(ADMIN_PROFILE_ENDPOINT)
		const userData = data.data as AuthUser
		return userData;
	} catch (err) {
		return null
	}
}

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {

	const user = await getLayoutData()

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
				<ReduxStoreProvider>
					{children}
					<PopUpsRenderer />
					<AuthPersistor userData={user || null} />
				</ReduxStoreProvider>
			</body>
		</html>
	)
}