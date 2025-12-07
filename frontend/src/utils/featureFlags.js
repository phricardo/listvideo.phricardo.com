const FEATURE_DISABLED_MESSAGES = {
  password_reset_email:
    "Recuperacao de senha esta temporariamente indisponivel porque o envio de e-mail foi desativado para reduzir custos do projeto.",
  activation_resend_email:
    "O reenvio do e-mail de ativacao esta desativado no momento para manter os custos baixos. Tente novamente mais tarde.",
};

export const isFeatureEnabled = (features, key) => {
  if (!features || typeof features[key] === "undefined") return true;
  return Boolean(features[key]);
};

export const getFeatureDisabledMessage = (key) =>
  FEATURE_DISABLED_MESSAGES[key] ||
  "Esta funcionalidade esta temporariamente indisponivel.";
