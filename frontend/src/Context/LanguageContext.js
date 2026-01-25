import React from "react";

export const LanguageContext = React.createContext();

const supportedLanguages = ["pt", "en"];

export const LanguageStorage = ({ children }) => {
  const getDefaultLanguage = React.useCallback(
    () => (navigator.language.split("-")[0] === "pt" ? "pt" : "en"),
    []
  );

  const normalizeLanguage = React.useCallback(
    (value) =>
      supportedLanguages.includes(value) ? value : getDefaultLanguage(),
    [getDefaultLanguage]
  );

  const [language, setLanguage] = React.useState(() => getDefaultLanguage());

  const handleLanguage = (value) => {
    const normalized = normalizeLanguage(value);
    setLanguage(normalized);
    localStorage.setItem("language", normalized);
  };

  React.useEffect(() => {
    const lang = localStorage.getItem("language");
    if (lang) setLanguage(normalizeLanguage(lang));
  }, [normalizeLanguage]);

  return (
    <LanguageContext.Provider value={{ handleLanguage, language }}>
      {children}
    </LanguageContext.Provider>
  );
};