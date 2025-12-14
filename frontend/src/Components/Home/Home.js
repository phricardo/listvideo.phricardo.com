import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import { Icon } from "@iconify/react";
import logo_dark from "../../Assets/logo_secondary_black.png";
import logo_light from "../../Assets/logo_primary.png";
import { ThemeContext } from "../../Context/ThemeContext";
import { LanguageContext } from "../../Context/LanguageContext";
import lang from "../../lang.json";

const Home = () => {
  const [value, setValue] = React.useState("");
  const [error, setError] = React.useState(null);
  const { theme } = React.useContext(ThemeContext);
  const { language } = React.useContext(LanguageContext);
  const input = React.useRef(null);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (value === "" || value.length <= 10) {
      setError(`⚠️ ${lang[language]["home"].inputError}`);
      input.current.focus();
      return null;
    }
    const url = value.trim().replace(/\s/g, "");
    getPlaylistId(url);
  };

  const getPlaylistId = (url) => {
    const match = url.match(/list=([^&]+)/);
    if (match) {
      navigate(`/playlist/${match[1]}`);
    } else {
      setError(`⚠️ ${lang[language]["home"].inputError}`);
      input.current.focus();
      return null;
    }
  };

  return (
    <div>
      <Header />
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.imageholder}>
              <div>BETA</div>
              <img
                src={theme === "light" ? logo_dark : logo_light}
                alt="ListVideo App Logo"
              />
            </div>
            <p>{lang[language]["home"].description}</p>
          </div>
          <form onSubmit={handleSubmit} className={styles.form}>
            <label htmlFor="playlist">{lang[language]["home"].label}</label>
            <input
              type="text"
              name="playlist"
              id="playlist"
              ref={input}
              placeholder={lang[language]["home"].placeholder}
              value={value}
              onChange={({ target }) => setValue(target.value)}
            />
            {error && <p>{error}</p>}
            <button className={styles.btn}>
              <Icon
                icon="material-symbols:play-circle"
                className={styles.icon}
              />{" "}
              {lang[language]["home"].button}
            </button>
          </form>

          <div className={styles.card}>
            <div>
              <Icon
                icon="material-symbols:do-not-disturb-on-total-silence-outline-rounded"
                className={styles.icon}
              />
              <h1>{lang[language]["home"].card1.title}</h1>
              <p>{lang[language]["home"].card1.description}</p>
            </div>
            <div>
              <Icon
                icon="teenyicons:certificate-solid"
                className={styles.icon}
              />
              <h1>{lang[language]["home"].card2.title}</h1>
              <p>{lang[language]["home"].card2.description}</p>
            </div>
            <div>
              <Icon
                icon="material-symbols:signal-cellular-3-bar-rounded"
                className={styles.icon}
              />
              <h1>{lang[language]["home"].card3.title}</h1>
              <p>{lang[language]["home"].card3.description}</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
