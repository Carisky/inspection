import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Register from "@/Register";
import { LocaleProvider } from "@/context/LocaleContext"; // Предполагается, что LocaleProvider в этом пути

Register.init();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <LocaleProvider>
      <Component {...pageProps} />
    </LocaleProvider>
  );
}
