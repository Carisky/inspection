import { useRouter } from "next/router";
import { useLocaleStore } from "@/stores/useLocaleStore";
import React from "react";
import Cookies from "js-cookie";
import Image from "next/image";
import { Box } from "@mui/material";
const LanguageSwitcher = ({direction=""}) => {
  const router = useRouter();
  const { locale, setLocale } = useLocaleStore();
  const supportedLocales = ["ru", "en", "ua", "pl"];

  const switchLanguage = (newLocale: string) => {
    if (newLocale === locale) return;

    // Обновляем локаль в zustand
    setLocale(newLocale);
    // Сохраняем выбранную локаль в cookie (например, на 1 месяц)
    Cookies.set("locale", newLocale, { expires: 30 });

    // Меняем URL: заменяем текущий языковой сегмент на новый
    const newPath = router.asPath.replace(
      /^\/(ru|en|ua|pl)/,
      `/${newLocale}`
    );
    router.push(newPath);
  };

  return (
    <Box sx={{display: "flex", gap: "10px", flexDirection:direction }}>
      {supportedLocales.map((lng) => (
        <Box
          key={lng}
          onClick={() => switchLanguage(lng)}
          style={{
            cursor: "pointer",
            border: locale === lng ? "2px solid #000" : "2px solid transparent",
            borderRadius: "4px",
            padding: "2px",
          }}
        >
          <Image
            src={`/images/assets/flags/${lng}.png`}
            alt={lng}
            width={32}
            height={32}
            style={{ display: "block" }}
          />
        </Box>
      ))}
    </Box>
  );
};

export default LanguageSwitcher;
