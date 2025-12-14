import React from "react";
import styles from "./Settings.module.css";
import { ThemeContext } from "../../Context/ThemeContext";
import { AutoplayContext } from "../../Context/AutoplayContext";
import { LanguageContext } from "../../Context/LanguageContext";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import SwitchButton from "../Helper/SwitchButton";
import { Icon } from "@iconify/react";
import lang from "../../lang.json";

const Settings = () => {
  const { handleThemeChange, theme } = React.useContext(ThemeContext);
  const { autoplay, handleAutoplay } = React.useContext(AutoplayContext);
  const { handleLanguage, language } = React.useContext(LanguageContext);
  const languageOptions = [
    {
      code: "pt",
      label: lang[language]["settings"].language.ptLabel,
      icon: "twemoji:flag-brazil",
    },
    {
      code: "en",
      label: lang[language]["settings"].language.enLabel,
      icon: "la:flag-usa",
    },
  ];

  return (
    <>
      <Header />
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <h1>{lang[language]["settings"].title}</h1>

          <div className={styles.settings}>
            <div>
              <h2>{lang[language]["settings"].autoplay.title}</h2>
              <p>{lang[language]["settings"].autoplay.description}</p>
              <SwitchButton
                label=""
                checked={autoplay}
                onChange={() => handleAutoplay(!autoplay)}
              />
            </div>

            <div>
              <h2>{lang[language]["settings"].language.title}</h2>
              <p>{lang[language]["settings"].language.description}</p>
              <div className={styles.languageOptions}>
                {languageOptions.map((item) => (
                  <button
                    key={item.code}
                    onClick={() => handleLanguage(item.code)}
                    className={`${styles.button} ${
                      language === item.code ? styles.buttonActive : ""
                    }`}
                  >
                    {item.label}
                    <Icon icon={item.icon} className={styles.icon} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2>{lang[language]["settings"].theme.title}</h2>
              <p>{lang[language]["settings"].theme.description}</p>
              <button
                onClick={() => handleThemeChange(!theme)}
                className={styles.button}
              >
                {lang[language]["header"].btn_theme}
                <Icon
                  icon={
                    theme !== "light"
                      ? "material-symbols:light-mode-outline-sharp"
                      : "ph:moon-bold"
                  }
                  className={styles.icon}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Settings;
