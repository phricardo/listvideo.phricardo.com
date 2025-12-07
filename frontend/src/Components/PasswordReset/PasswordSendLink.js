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
  const isPasswordResetEmailEnabled = isFeatureEnabled(
    features,
    "password_reset_email"
  );
  const featureDisabledMessage = getFeatureDisabledMessage(
    "password_reset_email"
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
      setError("Por favor, informe seu email.");
    } else {
      const { url, options } = USER_SEND_TOKEN_PASSWORD(email.value);
      const response = await fetch(url, options);
      const payload = await safeParseJson(response);

      if (response.ok) {
        toastApiSuccess("Email enviado com sucesso!");
      } else {
        const message = toastApiError(
          payload,
          "Nao conseguimos enviar o e-mail de recuperacao."
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
      setError("Por favor, preencha todos os campos.");
      return;
    }

    if (newPassword.value !== confirmPassword.value) {
      setError("As senhas nao coincidem. Por favor, verifique novamente.");
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
      toastApiSuccess("Senha alterada com sucesso!");
      navigate("/login");
    } else {
      const apiError = getFirstApiError(payload);
      const message = toastApiError(
        apiError,
        "Ocorreu um erro ao mudar sua senha."
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
          <h1>Recuperacao de senha</h1>
          {!token && (
            <form className={styles.form} onSubmit={handleEmailSubmit}>
              <Input
                label="Informe seu email"
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
                {isLoading ? "Enviando..." : "Enviar"}
              </button>
            </form>
          )}
          {token && isValidToken && (
            <form className={styles.form} onSubmit={handleResetPasswordSubmit}>
              <PasswordShowHide
                label="Nova senha"
                name="newPassword"
                type="password"
                {...newPassword}
              />
              <PasswordShowHide
                label="Confirme a senha"
                name="confirmPassword"
                type="password"
                {...confirmPassword}
              />
              <button type="submit" disabled={isLoading}>
                {isLoading ? "Enviando..." : "Enviar"}
              </button>
            </form>
          )}
          {token && !isValidToken && <p>Token expirado ou invÇ­lido!</p>}
          {error && <p>{error}</p>}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PasswordSendLink;
