import type {Metadata} from "next"
import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
import {ColorSchemeScript, mantineHtmlProps, MantineProvider} from '@mantine/core'

import "./globals.css"
import NavBar from '@/components/NavBar/NavBar'
import {theme} from './theme'

// const geistSans = Geist({
//     variable: "--font-geist-sans",
//     subsets: ["latin"]
// })
//
// const geistMono = Geist_Mono({
//     variable: "--font-geist-mono",
//     subsets: ["latin"]
// })

//
// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html
//       lang="en"
//       className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
//     >
//       <body className="min-h-full flex flex-col">
//         {children}
//       </body>
//     </html>
//   );
// }

export const metadata: Metadata = {
    title: "Open Blink",
    description: "Your Open Source Object Detector"
}

export default function RootLayout({
                                       children
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" {...mantineHtmlProps}>
        <head>
            <ColorSchemeScript/>
        </head>
        <body>
        <MantineProvider theme={theme} defaultColorScheme={'auto'}>
            <NavBar/>
            {children}
        </MantineProvider>
        </body>
        </html>
    )
}