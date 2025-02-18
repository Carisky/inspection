import React, { createContext, useContext, useEffect, useState } from "react";

interface LocaleContextProps {
  locale: string;
}

const LocaleContext = createContext<LocaleContextProps>({ locale: "ru" });

export const useLocale = () => useContext(LocaleContext);

interface LocaleProviderProps {
  children: React.ReactNode;
}

export const LocaleProvider: React.FC<LocaleProviderProps> = ({ children }) => {
  const [locale, setLocale] = useState("ru");

  useEffect(() => {
    const browserLocale = navigator.language || navigator.language;
    setLocale(browserLocale.split("-")[0]); // Используем только код языка, без региона
  }, []);

  return (
    <LocaleContext.Provider value={{ locale }}>
      {children}
    </LocaleContext.Provider>
  );
};
