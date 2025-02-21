import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useRouter } from "next/router";
import { useEffect } from "react";

interface LocaleState {
  locale: string;
  setLocale: (locale: string) => void;
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: "ru",
      setLocale: (locale) => set({ locale }),
    }),
    { name: "locale-storage" }
  )
);

export const useInitLocale = () => {
  const router = useRouter();
  const { locale, setLocale } = useLocaleStore();

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.location.search.includes("builder")
    ) {
      return;
    }

    const urlLocale = router.query.lang as string;
    const browserLocale = navigator.language.split("-")[0];
    const defaultLocale = urlLocale || browserLocale || "ru";

    if (locale !== defaultLocale) {
      setLocale(defaultLocale);
    }

    if (!urlLocale) {
      router.replace(
        {
          pathname: router.pathname,
          query: { ...router.query, lang: defaultLocale },
        },
        undefined,
        { shallow: true }
      );
    }
  }, [router.query.lang, locale, setLocale]);
};
