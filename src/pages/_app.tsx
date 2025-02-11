import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Builder } from '@builder.io/react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";

Builder.registerComponent(Header, {
  name: 'Header',
});

Builder.registerComponent(Footer, {
  name: 'Footer',
});

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
