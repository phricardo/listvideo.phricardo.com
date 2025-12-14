const FEATURE_DISABLED_MESSAGES = {
  password_reset_email: {
    pt: "Recuperação de senha está temporariamente indisponível porque o envio de e-mail foi desativado para reduzir os custos do projeto.",
    en: "Password recovery is temporarily unavailable because email sending is disabled to reduce project costs.",
  },
  activation_resend_email: {
    pt: "O reenvio do e-mail de ativação está desativado no momento para manter os custos baixos. Tente novamente mais tarde.",
    en: "Resending the activation email is disabled right now to keep costs low. Please try again later.",
  },
};

const DEFAULT_DISABLED_MESSAGE = {
  pt: "Esta funcionalidade está temporariamente indisponível.",
  en: "This feature is temporarily unavailable.",
};

export const isFeatureEnabled = (features, key) => {
  if (!features || typeof features[key] === "undefined") return true;
  return Boolean(features[key]);
};

export const getFeatureDisabledMessage = (key, language = "pt") => {
  const langKey = language === "en" ? "en" : "pt";
  const byKey = FEATURE_DISABLED_MESSAGES[key];
  if (byKey) return byKey[langKey] || byKey.en || byKey.pt;
  return DEFAULT_DISABLED_MESSAGE[langKey];
};
