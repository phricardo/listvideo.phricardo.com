import React from "react";
import styles from "./Header.module.css";
import { Icon } from "@iconify/react";
import { UserContext } from "../../Context/UserContext";
import { LanguageContext } from "../../Context/LanguageContext";
import { ThemeContext } from "../../Context/ThemeContext";
import { Link, useLocation } from "react-router-dom";
import logo_dark from "../../Assets/logo_secondary_black_h.png";
import logo_light from "../../Assets/logo_secondary_white.png";
import lang from "../../lang.json";
import UserName from "./UserName";

const Header = () => {
  const { login, user, userLogout } = React.useContext(UserContext);
  const { theme } = React.useContext(ThemeContext);
  const { language } = React.useContext(LanguageContext);
  const { pathname } = useLocation();
  const [showMobileMenu, setShowMobileMenu] = React.useState(false);

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <Link to="/">
            <img
              src={theme === "light" ? logo_dark : logo_light}
              alt="ListVideo App"
            ></img>
          </Link>
        </div>
        <ul className={`${styles.navLinks} ${showMobileMenu && styles.acitve}`}>
          {pathname !== "/" && (
            <li className={styles.navLink}>
              <Link to="/">
                <Icon
                  icon="material-symbols:home-rounded"
                  className={styles.icon}
                />
                {lang[language]["header"].btn_home}
              </Link>
            </li>
          )}

          {!login ? (
            <>
              <li className={styles.navLink}>
                <Link to="/login">
                  <Icon icon="majesticons:login-line" className={styles.icon} />
                  {lang[language]["header"].link_login}
                </Link>
              </li>
              <li className={styles.navLink}>
                <Link to="/register">
                  <Icon icon="mdi:register" className={styles.icon} />
                  {lang[language]["header"].link_register}
                </Link>
              </li>
            </>
          ) : (
            <>
              <Link to={`/@${user?.username}`} className={styles.profile}>
                <Icon icon="pajamas:profile" className={styles.icon} />
                <UserName
                  username={user?.username}
                  isVerified={user?.isVerifiedAccount}
                />
              </Link>

              <li className={styles.navLink}>
                <button
                  onClick={() =>
                    userLogout(lang[language]["header"].logoutConfirm)
                  }
                >
                  <Icon
                    icon="material-symbols:logout-rounded"
                    className={styles.icon}
                  />
                  {lang[language]["header"].logout}
                </button>
              </li>
            </>
          )}

          <li className={styles.navLink}>
            <Link to="/settings">
              <Icon icon="material-symbols:settings" className={styles.icon} />
              {lang[language]["header"].btn_settings}
            </Link>
          </li>
        </ul>

        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className={styles.btnMobileMenu}
        >
          {!showMobileMenu ? (
            <Icon icon="ic:outline-menu" className={styles.icon} />
          ) : (
            <Icon
              icon="material-symbols:close-rounded"
              className={styles.icon}
            />
          )}
        </button>
      </div>
    </nav>
  );
};

export default Header;
