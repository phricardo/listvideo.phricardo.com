import { toast } from "react-toastify";

const DEFAULT_ERROR_MESSAGE =
  "Nao foi possivel concluir a solicitacao. Tente novamente.";

const ERROR_MESSAGES = {
  "resource.not.found": "Recurso nao encontrado.",
  "validation.failed":
    "Alguns campos precisam de atencao. Confira os dados e tente novamente.",
  "request.payload.invalid":
    "Requisicao invalida. Recarregue a pagina e tente de novo.",
  "auth.credentials.invalid":
    "Email ou senha incorretos. Confira os dados ou redefina a senha.",
  "user.email.not.verified":
    "Confirme seu e-mail antes de acessar. Reenvie o link se precisar.",
  "authentication.failed": "Nao foi possivel autenticar. Faca login novamente.",
  "access.denied": "Voce nao tem permissao para executar essa acao.",
  "data.integrity.violation":
    "Nao foi possivel concluir porque ha conflito com dados existentes.",
  "data.duplicate.value": ({ params }) => {
    const field = params?.field;
    const value = params?.value;
    if (field && value) {
      return `O valor "${value}" para "${field}" ja esta em uso.`;
    }
    return "Um registro com estes dados ja existe.";
  },
  "registration.error":
    "Nao foi possivel criar sua conta. Tente novamente em instantes.",
  "registration.request.null":
    "Dados de cadastro ausentes. Preencha o formulario e tente novamente.",
  "user.already.activated":
    "Sua conta ja esta ativada. Basta fazer login para continuar.",
  "invalid.argument": "Dados invalidos. Confira e tente novamente.",
  "invalid.format": "Formato invalido nos dados enviados.",
  "internal.server.error": "Erro inesperado. Tente novamente em instantes.",
  "password.reset.token.invalid":
    "Link de redefinicao invalido ou expirado. Solicite um novo.",
  "password.reset.token.missing":
    "Nao encontramos o link de redefinicao. Solicite novamente.",
  "user.not.found.by.username": "Usuario nao encontrado.",
  "user.not.found.by.email": "E-mail nao encontrado.",
  "certificate.not.found":
    "Certificado nao encontrado. Gere novamente a partir da playlist.",
  "account.activation.notfound":
    "Nao foi possivel ativar a conta. Solicite um novo e-mail de ativacao.",
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
