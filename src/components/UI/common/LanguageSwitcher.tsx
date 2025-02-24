import { useRouter } from "next/router";
import { useLocaleStore } from "@/stores/useLocaleStore";
import React from "react";
import Cookies from "js-cookie";

const LanguageSwitcher = () => {
  const router = useRouter();
  const { locale, setLocale } = useLocaleStore();
  const supportedLocales = ["ru", "en", "ua", "pl"];

  const switchLanguage = (newLocale: string) => {
    if (newLocale === locale) return;

    // Обновляем локаль в zustand
    setLocale(newLocale);
    // Сохраняем выбранную локаль в cookie (например, на 1 год)
    Cookies.set("locale", newLocale, { expires: 365 });

    // Меняем URL: заменяем текущий языковой сегмент на новый
    const newPath = router.asPath.replace(
      /^\/(ru|en|ua|pl)/,
      `/${newLocale}`
    );
    router.push(newPath);
  };

  return (
    <div>
      {supportedLocales.map((lng) => (
        <button
          key={lng}
          onClick={() => switchLanguage(lng)}
          style={{
            fontWeight: locale === lng ? "bold" : "normal",
            marginRight: "10px",
          }}
        >
          {lng.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
