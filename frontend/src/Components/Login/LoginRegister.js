import React from "react";
import styles from "./LoginRegister.module.css";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Input from "../Input/Input";
import PasswordShowHide from "../Input/PasswordShowHide";
import useFetch from "../../Hooks/useFetch";
import useForm from "../../Hooks/useForm";
import { Link, useNavigate } from "react-router-dom";
import { USER_POST } from "../../Api";
import { UserContext } from "../../Context/UserContext";
import { LanguageContext } from "../../Context/LanguageContext";
import lang from "../../lang.json";
import { Icon } from "@iconify/react";
import { Email, domains } from "@smastrom/react-email-autocomplete";
import InputUsernameAvailability from "../Input/InputUsernameAvailability";
import { toastApiSuccess } from "../../utils/apiErrors";

const Register = () => {
  const name = useForm();
  const email = useForm("email");
  const username = useForm("username");
  const password = useForm("password");
  const [isChecked, setIsChecked] = React.useState(false);
  const [errorChecked, setErrorChecked] = React.useState(null);
  const { login } = React.useContext(UserContext);
  const { language } = React.useContext(LanguageContext);
  const { error, request, loading } = useFetch();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (login) navigate("/");
  }, [login, navigate]);

  const handleChange = (event) => {
    if (event.target.checked === true) setErrorChecked(null);
    setIsChecked(event.target.checked);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isChecked) {
      if (
        name.validate() &&
        email.validate() &&
        username.validate() &&
        password.validate()
      ) {
        const { url, options } = USER_POST({
          name: name.value,
          email: email.value,
          username: username.value.toLowerCase(),
          password: password.value,
        });
        const { response } = await request(url, options, {
          fallbackMessage:
            "Não foi possível criar sua conta. Tente novamente.",
        });
        if (response?.ok) {
          toastApiSuccess(
            "Conta criada! Você receberá um e-mail para ativar seu acesso."
          );
          navigate("/login");
        }
      }
    } else {
      setErrorChecked(lang[language]["register"].errorChecked);
    }
  };
  const baseList = [
    "gmail.com",
    "outlook.com",
    "hotmail.com",
    "yahoo.com",
    "uol.com.br",
    "bol.com.br",
    "msn.com",
    "aol.com",
    "msn.com",
  ];

  return (
    <>
      <Header />
      <div className={styles.login}>
        <div className={styles.container}>
          <div className={styles.wrapper}>
            <h1>{lang[language]["register"].title}</h1>
            <form className={styles.form} onSubmit={handleSubmit}>
              <Input
                label={lang[language]["register"].nameLabel}
                name="name"
                type="text"
                {...name}
              />

              <div className={styles.emailGroup}>
                <label>E-mail: </label>
                <Email
                  className={styles.myWrapper}
                  baseList={baseList}
                  refineList={domains}
                  onChange={email.setValue}
                  value={email.value}
                />
              </div>

              <InputUsernameAvailability
                label={lang[language]["register"].usernameLabel}
                name="username"
                type="text"
                {...username}
              />

              <PasswordShowHide
                label={lang[language]["register"].passwordLabel}
                name="password"
                {...password}
              />

              <label htmlFor="checkbox" className={styles.policy}>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={handleChange}
                  id="checkbox"
                ></input>
                {lang[language]["register"].terms}{" "}
                <Link to="/terms" className={styles.terms}>
                  {lang[language]["register"].termsLink}
                </Link>
              </label>
              {errorChecked && <p>* {errorChecked}</p>}

              <button disabled={loading}>
                {!loading ? (
                  lang[language]["register"].registerBtn
                ) : (
                  <Icon icon="fontisto:spinner" className="spinAnimate" />
                )}
              </button>
            </form>
            {error && <p>{error.message}</p>}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Register;
