import { toast } from "react-toastify";

const DEFAULT_ERROR_MESSAGE =
  "Não foi possível concluir a solicitação. Tente novamente.";

const ERROR_MESSAGES = {
  "resource.not.found": "Recurso não encontrado.",
  "validation.failed":
    "Alguns campos precisam de atenção. Confira os dados e tente novamente.",
  "request.payload.invalid":
    "Requisição inválida. Recarregue a página e tente de novo.",
  "auth.credentials.invalid":
    "E-mail ou senha incorretos. Confira os dados ou redefina a senha.",
  "user.email.not.verified":
    "Confirme seu e-mail antes de acessar. Reenvie o link se precisar.",
  "authentication.failed": "Não foi possível autenticar. Faça login novamente.",
  "access.denied": "Você não tem permissão para executar essa ação.",
  "data.integrity.violation":
    "Não foi possível concluir porque há conflito com dados existentes.",
  "data.duplicate.value": ({ params }) => {
    const field = params?.field;
    const value = params?.value;
    if (field && value) {
      return `O valor "${value}" para "${field}" já está em uso.`;
    }
    return "Um registro com estes dados já existe.";
  },
  "registration.error":
    "Não foi possível criar sua conta. Tente novamente em instantes.",
  "registration.request.null":
    "Dados de cadastro ausentes. Preencha o formulário e tente novamente.",
  "user.already.activated":
    "Sua conta já está ativada. Basta fazer login para continuar.",
  "invalid.argument": "Dados inválidos. Confira e tente novamente.",
  "invalid.format": "Formato inválido nos dados enviados.",
  "internal.server.error": "Erro inesperado. Tente novamente em instantes.",
  "password.reset.token.invalid":
    "Link de redefinição inválido ou expirado. Solicite um novo.",
  "password.reset.token.missing":
    "Não encontramos o link de redefinição. Solicite novamente.",
  "user.not.found.by.username": "Usuário não encontrado.",
  "user.not.found.by.email": "E-mail não encontrado.",
  "certificate.not.found":
    "Certificado não encontrado. Gere novamente a partir da playlist.",
  "account.activation.notfound":
    "Não foi possível ativar a conta. Solicite um novo e-mail de ativação.",
};

export const safeParseJson = async (response) => {
  try {
    return await response.json();
  } catch (error) {
    return null;
  }
};

export const getFirstApiError = (payload) => {
  if (payload?.errors && Array.isArray(payload.errors) && payload.errors.length) {
    return payload.errors[0];
  }
  if (payload?.error) return payload.error;
  return null;
};

export const getFriendlyMessage = (payloadOrError, fallbackMessage = DEFAULT_ERROR_MESSAGE) => {
  const error = payloadOrError?.code ? payloadOrError : getFirstApiError(payloadOrError);
  const code = error?.code;
  const mapper = code ? ERROR_MESSAGES[code] : null;

  if (typeof mapper === "function") return mapper(error);
  if (typeof mapper === "string") return mapper;
  if (error?.message) return error.message;

  return fallbackMessage;
};

export const toastApiError = (payloadOrError, fallbackMessage) => {
  const message = getFriendlyMessage(payloadOrError, fallbackMessage);
  toast.error(message);
  return message;
};

export const toastApiSuccess = (message) => {
  toast.success(message);
};
