import React from "react";
import styles from "./Footer.module.css";
import { ThemeContext } from "../../Context/ThemeContext";
import { LanguageContext } from "../../Context/LanguageContext";
import logo_dark from "../../Assets/logo_secondary_black_h.png";
import logo_light from "../../Assets/logo_secondary_white.png";
import lang from "../../lang.json";

const Footer = () => {
  const { theme } = React.useContext(ThemeContext);
  const { language } = React.useContext(LanguageContext);

  return (
    <div className={styles.footer}>
      <img
        className={styles.logo}
        src={theme === "light" ? logo_dark : logo_light}
        alt="ListVideo App Logo"
      ></img>

      <p className={styles.text}>
        {lang[language]["footer"].poweredBy}{" "}
        <a href="https://phricardo.com/" target="_blank" noreferrer>
          @phricardorj | @phricardo
        </a>
      </p>
    </div>
  );
};

export default Footer;
