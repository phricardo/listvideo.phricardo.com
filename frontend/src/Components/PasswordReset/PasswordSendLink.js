import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import styles from "./PasswordSendLink.module.css";
import Input from "../Input/Input";
import useForm from "../../Hooks/useForm";
import { USER_RESET_TOKEN_PASSWORD, USER_SEND_TOKEN_PASSWORD } from "../../Api";
import PasswordShowHide from "../Input/PasswordShowHide";
import {
  getFirstApiError,
  safeParseJson,
  toastApiError,
  toastApiSuccess,
} from "../../utils/apiErrors";
import { ServiceStatusContext } from "../../Context/ServiceStatusContext";
import {
  getFeatureDisabledMessage,
  isFeatureEnabled,
} from "../../utils/featureFlags";
import { LanguageContext } from "../../Context/LanguageContext";
import lang from "../../lang.json";

const PasswordSendLink = () => {
  const { token } = useParams();
  const email = useForm("email");
  const newPassword = useForm("password");
  const confirmPassword = useForm();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(true);
  const [error, setError] = useState(null);
  const { features } = React.useContext(ServiceStatusContext);
  const { language } = React.useContext(LanguageContext);
  const isPasswordResetEmailEnabled = isFeatureEnabled(
    features,
    "password_reset_email"
  );
  const featureDisabledMessage = getFeatureDisabledMessage(
    "password_reset_email",
    language
  );

  const handleEmailSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (!isPasswordResetEmailEnabled) {
      setError(featureDisabledMessage);
      return;
    }

    setIsLoading(true);

    if (email.value.trim() === "") {
      setError(lang[language]["passwordReset"].emailRequired);
    } else {
      const { url, options } = USER_SEND_TOKEN_PASSWORD(email.value, language);
      const response = await fetch(url, options);
      const payload = await safeParseJson(response);

      if (response.ok) {
        toastApiSuccess(lang[language]["passwordReset"].successEmail);
      } else {
        const message = toastApiError(
          payload,
          lang[language]["passwordReset"].errorEmailSend
        );
        setError(message);
      }
    }

    setIsLoading(false);
  };

  const handleResetPasswordSubmit = async (event) => {
    event.preventDefault();

    if (
      newPassword.value.trim() === "" ||
      confirmPassword.value.trim() === ""
    ) {
      setError(lang[language]["passwordReset"].fieldsRequired);
      return;
    }

    if (newPassword.value !== confirmPassword.value) {
      setError(lang[language]["passwordReset"].passwordMismatch);
      return;
    }

    setIsLoading(true);

    const { url, options } = USER_RESET_TOKEN_PASSWORD({
      token: token,
      newPassword: newPassword.value,
    });
    const response = await fetch(url, options);
    const payload = await safeParseJson(response);
    if (response.ok) {
      toastApiSuccess(lang[language]["passwordReset"].successReset);
      navigate("/login");
    } else {
      const apiError = getFirstApiError(payload);
      const message = toastApiError(
        apiError,
        lang[language]["passwordReset"].errorPasswordChange
      );
      setError(message);
      if (apiError?.code === "password.reset.token.invalid") {
        setIsValidToken(false);
        navigate("/forgot-password");
      }
    }

    setIsLoading(false);
  };

  return (
    <>
      <Header />
      <div className={styles.wrapper}>
        <div className={styles.box}>
          <h1>{lang[language]["passwordReset"].title}</h1>
          {!token && (
            <form className={styles.form} onSubmit={handleEmailSubmit}>
              <Input
                label={lang[language]["passwordReset"].emailLabel}
                name="email"
                type="text"
                {...email}
              />
              {!isPasswordResetEmailEnabled && (
                <div className={styles.notice}>{featureDisabledMessage}</div>
              )}
              <button
                type="submit"
                disabled={isLoading || !isPasswordResetEmailEnabled}
              >
                {isLoading
                  ? lang[language]["passwordReset"].sending
                  : lang[language]["passwordReset"].sendButton}
              </button>
            </form>
          )}
          {token && isValidToken && (
            <form className={styles.form} onSubmit={handleResetPasswordSubmit}>
              <PasswordShowHide
                label={lang[language]["passwordReset"].newPasswordLabel}
                name="newPassword"
                type="password"
                {...newPassword}
              />
              <PasswordShowHide
                label={lang[language]["passwordReset"].confirmPasswordLabel}
                name="confirmPassword"
                type="password"
                {...confirmPassword}
              />
              <button type="submit" disabled={isLoading}>
                {isLoading
                  ? lang[language]["passwordReset"].submitting
                  : lang[language]["passwordReset"].submitButton}
              </button>
            </form>
          )}
          {token && !isValidToken && (
            <p>{lang[language]["passwordReset"].tokenInvalid}</p>
          )}
          {error && <p>{error}</p>}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PasswordSendLink;
