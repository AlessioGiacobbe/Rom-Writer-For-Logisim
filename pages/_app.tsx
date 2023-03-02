import type { AppProps } from "next/app"
import { ThemeProvider } from "next-themes"

import "@/styles/globals.css"


export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <style jsx global>{`
				:root {
					--font-sans: Inter-Medium;
				}
			}`}</style>
      <ThemeProvider themes={['light', 'dark']} attribute="class" defaultTheme="system" enableSystem>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  )
}
