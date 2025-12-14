package br.com.phricardo.listvideo.exception.handler;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ErrorKey {
  RESOURCE_NOT_FOUND("resource.not.found"),
  VALIDATION_FAILED("validation.failed"),
  REQUEST_PAYLOAD_INVALID("request.payload.invalid"),
  AUTH_CREDENTIALS_INVALID("auth.credentials.invalid"),
  USER_EMAIL_NOT_VERIFIED("user.email.not.verified"),
  AUTHENTICATION_FAILED("authentication.failed"),
  ACCESS_DENIED("access.denied"),
  DATA_INTEGRITY_VIOLATION("data.integrity.violation"),
  DATA_DUPLICATE_VALUE("data.duplicate.value"),
  REGISTRATION_ERROR("registration.error"),
  REGISTRATION_REQUEST_NULL("registration.request.null"),
  USER_ALREADY_ACTIVATED("user.already.activated"),
  INVALID_ARGUMENT("invalid.argument"),
  INVALID_FORMAT("invalid.format"),
  INTERNAL_SERVER_ERROR("internal.server.error"),
  PASSWORD_RESET_TOKEN_INVALID("password.reset.token.invalid"),
  PASSWORD_RESET_TOKEN_MISSING("password.reset.token.missing"),
  USER_NOT_FOUND_BY_USERNAME("user.not.found.by.username"),
  USER_NOT_FOUND_BY_EMAIL("user.not.found.by.email"),
  CERTIFICATE_NOT_FOUND("certificate.not.found"),
  ACCOUNT_ACTIVATION_NOTFOUND("account.activation.notfound"),
  SAVED_COURSE_NOT_FOUND("saved.course.not.found"),
  SAVED_COURSE_AUTHOR_IMMUTABLE("saved.course.author.immutable");

  private final String key;
}
