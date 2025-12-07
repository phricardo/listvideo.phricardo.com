import React from "react";

export const LanguageContext = React.createContext();

export const LanguageStorage = ({ children }) => {
  // const [language, setLanguage] = React.useState(
  //   navigator.language.split("-")[0] === "pt" ? "pt" : "en"
  // );

  const [language, setLanguage] = React.useState(
    navigator.language.split("-")[0] === "pt" ? "pt" : "pt"
  );

  const handleLanguage = (value) => {
    setLanguage(value);
    localStorage.setItem("language", value);
  };

  React.useEffect(() => {
    const lang = localStorage.getItem("language");
    if (lang) setLanguage(lang);
  }, []);

  return (
    <LanguageContext.Provider value={{ handleLanguage, language }}>
      {children}
    </LanguageContext.Provider>
  );
};
