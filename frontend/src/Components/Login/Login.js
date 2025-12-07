import React from "react";
import styles from "./Login.module.css";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Input from "../Input/Input";
import PasswordShowHide from "../Input/PasswordShowHide";
import useForm from "../../Hooks/useForm";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../Context/UserContext";
import { LanguageContext } from "../../Context/LanguageContext";
import { Icon } from "@iconify/react";
import lang from "../../lang.json";

const Login = () => {
  const username = useForm();
  const password = useForm();
  const { userLogin, loading, login, error } = React.useContext(UserContext);
  const { language } = React.useContext(LanguageContext);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (login) navigate("/");
  }, [login, navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (username.validate() && password.validate()) {
      userLogin(username.value, password.value);
    }
  };

  return (
    <>
      <Header />
      <div className={styles.login}>
        <div className={styles.container}>
          <div className={styles.wrapper}>
            <h1>{lang[language]["login"].title} 👋</h1>
            <form className={styles.form} onSubmit={handleSubmit}>
              <Input
                label={lang[language]["login"].emailLabel}
                name="username"
                type="text"
                {...username}
              />
              <PasswordShowHide
                label={lang[language]["login"].passwordLabel}
                name="password"
                {...password}
              />
              <button disabled={loading}>
                {!loading ? (
                  lang[language]["login"].loginButton
                ) : (
                  <Icon icon="fontisto:spinner" className="spinAnimate" />
                )}
              </button>
            </form>
            {error && <p>{error.message}</p>}
            <div className={styles.register}>
              <p>{lang[language]["login"].registerMessage}</p>
              <Link to="/register">{lang[language]["login"].registerLink}</Link>
            </div>
            <div className={styles.register}>
              <p>Não está conseguindo acessar? </p>
              <Link to="/forgot-password">Redefina a sua senha</Link>
              <Link to="/resend-activation">Reenviar e-mail de ativação</Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
