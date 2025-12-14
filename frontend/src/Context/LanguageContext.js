import React from "react";

export const LanguageContext = React.createContext();

export const LanguageStorage = ({ children }) => {
  const supportedLanguages = ["pt", "en"];
  const getDefaultLanguage = () =>
    navigator.language.split("-")[0] === "pt" ? "pt" : "en";

  const normalizeLanguage = (value) =>
    supportedLanguages.includes(value) ? value : getDefaultLanguage();

  const [language, setLanguage] = React.useState(getDefaultLanguage());

  const handleLanguage = (value) => {
    const normalized = normalizeLanguage(value);
    setLanguage(normalized);
    localStorage.setItem("language", normalized);
  };

  React.useEffect(() => {
    const lang = localStorage.getItem("language");
    if (lang) setLanguage(normalizeLanguage(lang));
  }, []);

  return (
    <LanguageContext.Provider value={{ handleLanguage, language }}>
      {children}
    </LanguageContext.Provider>
  );
};
