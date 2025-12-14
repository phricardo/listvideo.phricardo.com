import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import styles from "./ResendLinkActivation.module.css";
import Input from "../Input/Input";
import useForm from "../../Hooks/useForm";
import { USER_RESEND_ACTIVATION_LINK } from "../../Api";
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

const ResendLinkActivation = () => {
  const { token } = useParams();
  const email = useForm("email");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { features } = React.useContext(ServiceStatusContext);
  const isActivationResendEnabled = isFeatureEnabled(
    features,
    "activation_resend_email"
  );
  const featureDisabledMessage = getFeatureDisabledMessage(
    "activation_resend_email"
  );

  const handleEmailSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!isActivationResendEnabled) {
      setError(featureDisabledMessage);
      setIsLoading(false);
      return;
    }

    if (email.value.trim() === "") {
      setError("Por favor, informe seu e-mail.");
    } else {
      const { url, options } = USER_RESEND_ACTIVATION_LINK(email.value);
      const response = await fetch(url, options);
      const payload = await safeParseJson(response);

      if (response.ok) {
        toastApiSuccess("E-mail reenviado com sucesso!");
        navigate("/login");
      } else {
        const apiError = getFirstApiError(payload);
        const message = toastApiError(
          apiError,
          "Não foi possível reenviar o e-mail de ativação."
        );
        setError(message);
        if (apiError?.code === "user.already.activated") {
          navigate("/login");
        }
      }
    }

    setIsLoading(false);
  };
  return (
    <>
      <Header />
      <div className={styles.wrapper}>
        <div className={styles.box}>
          <h1>Reenviar e-mail de ativação</h1>
          {!token && (
            <form className={styles.form} onSubmit={handleEmailSubmit}>
              <Input
                label="Informe seu e-mail cadastrado"
                name="email"
                type="text"
                {...email}
              />
              {!isActivationResendEnabled && (
                <div className={styles.notice}>{featureDisabledMessage}</div>
              )}
              <button
                type="submit"
                disabled={isLoading || !isActivationResendEnabled}
              >
                {isLoading ? "Enviando..." : "Enviar"}
              </button>
            </form>
          )}
          {error && <p>{error}</p>}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ResendLinkActivation;
