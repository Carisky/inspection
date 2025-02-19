import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Register from "@/Register";

Register.init();

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
