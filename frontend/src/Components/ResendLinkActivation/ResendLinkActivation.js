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
import { LanguageContext } from "../../Context/LanguageContext";
import lang from "../../lang.json";

const ResendLinkActivation = () => {
  const { token } = useParams();
  const email = useForm("email");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { features } = React.useContext(ServiceStatusContext);
  const { language } = React.useContext(LanguageContext);
  const isActivationResendEnabled = isFeatureEnabled(
    features,
    "activation_resend_email"
  );
  const featureDisabledMessage = getFeatureDisabledMessage(
    "activation_resend_email",
    language
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
      setError(lang[language]["activationResend"].emailRequired);
    } else {
      const { url, options } = USER_RESEND_ACTIVATION_LINK(
        email.value,
        language
      );
      const response = await fetch(url, options);
      const payload = await safeParseJson(response);

      if (response.ok) {
        toastApiSuccess(lang[language]["activationResend"].success);
        navigate("/login");
      } else {
        const apiError = getFirstApiError(payload);
        const message = toastApiError(
          apiError,
          lang[language]["activationResend"].error
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
          <h1>{lang[language]["activationResend"].title}</h1>
          {!token && (
            <form className={styles.form} onSubmit={handleEmailSubmit}>
              <Input
                label={lang[language]["activationResend"].emailLabel}
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
                {isLoading
                  ? lang[language]["activationResend"].sending
                  : lang[language]["activationResend"].sendButton}
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
