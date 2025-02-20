import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Register from "@/Register";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
Register.init();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <SpeedInsights />
      <Analytics />
    </>
  );
}
