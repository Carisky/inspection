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


    // Извлекаем локаль из динамического маршрута (например, /ru/about)
    const urlLocale = router.query.lang as string;
    // Если локаль не задана в маршруте – используем язык браузера
    const browserLocale = navigator.language.split("-")[0];
    const defaultLocale = urlLocale || browserLocale || "ru";

    if (locale !== defaultLocale) {
      setLocale(defaultLocale);
    }
  }, [router.query.lang, locale, setLocale]);
};
