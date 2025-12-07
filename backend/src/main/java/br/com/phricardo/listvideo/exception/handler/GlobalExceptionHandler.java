package br.com.phricardo.listvideo.exception.handler;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.CONFLICT;
import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

import br.com.phricardo.listvideo.exception.ApiException;
import br.com.phricardo.listvideo.exception.handler.ApiError;
import br.com.phricardo.listvideo.exception.handler.ErrorKey;
import br.com.phricardo.listvideo.utils.MessageUtils;
import jakarta.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.IllegalFormatConversionException;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.regex.Pattern;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
@RequiredArgsConstructor
public class GlobalExceptionHandler {

  private static final Pattern POSTGRES_UNIQUE_CONSTRAINT =
      Pattern.compile("Key \\(([^)]+)\\)=\\(([^)]+)\\) already exists");

  private final MessageUtils messageUtils;

  @ExceptionHandler(ApiException.class)
  public ResponseEntity<ErrorResponse> handleApiException(ApiException ex) {
    final var error =
        buildError(ex.getErrorKey(), ex.getParams(), ex.getMessageParams());
    return buildResponse(resolveStatus(ex.getErrorKey()), List.of(error));
  }

  @ExceptionHandler(EntityNotFoundException.class)
  public ResponseEntity<ErrorResponse> handleNotFound(EntityNotFoundException ex) {
    return buildResponse(NOT_FOUND, List.of(buildError(ErrorKey.RESOURCE_NOT_FOUND)));
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ErrorResponse> handleBadRequest(MethodArgumentNotValidException ex) {
    final var errors = ex.getFieldErrors().stream().map(this::mapValidationError).toList();
    return buildResponse(BAD_REQUEST, errors);
  }

  @ExceptionHandler(HttpMessageNotReadableException.class)
  public ResponseEntity<ErrorResponse> handleBadRequest(HttpMessageNotReadableException ex) {
    return buildResponse(BAD_REQUEST, List.of(buildError(ErrorKey.REQUEST_PAYLOAD_INVALID)));
  }

  @ExceptionHandler(BadCredentialsException.class)
  public ResponseEntity<ErrorResponse> handleBadCredentials() {
    return buildResponse(UNAUTHORIZED, List.of(buildError(ErrorKey.AUTH_CREDENTIALS_INVALID)));
  }

  @ExceptionHandler(AuthenticationException.class)
  public ResponseEntity<ErrorResponse> handleAuthenticationFailure() {
    return buildResponse(UNAUTHORIZED, List.of(buildError(ErrorKey.AUTHENTICATION_FAILED)));
  }

  @ExceptionHandler(AccessDeniedException.class)
  public ResponseEntity<ErrorResponse> handleAccessDenied() {
    return buildResponse(FORBIDDEN, List.of(buildError(ErrorKey.ACCESS_DENIED)));
  }

  @ExceptionHandler(DataIntegrityViolationException.class)
  public ResponseEntity<ErrorResponse> handleDataIntegrityViolation(
      DataIntegrityViolationException ex) {
    final var error = mapDataIntegrityViolation(ex);
    return buildResponse(CONFLICT, List.of(error));
  }

  @ExceptionHandler(NoSuchElementException.class)
  public ResponseEntity<ErrorResponse> handleNoSuchElement(NoSuchElementException ex) {
    return buildResponse(NOT_FOUND, List.of(buildError(ErrorKey.RESOURCE_NOT_FOUND)));
  }

  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<ErrorResponse> handleIllegalArgument(IllegalArgumentException ex) {
    return buildResponse(BAD_REQUEST, List.of(buildError(ErrorKey.INVALID_ARGUMENT)));
  }

  @ExceptionHandler(IllegalFormatConversionException.class)
  public ResponseEntity<ErrorResponse> handleIllegalFormatConversion(
      IllegalFormatConversionException ex) {
    return buildResponse(BAD_REQUEST, List.of(buildError(ErrorKey.INVALID_FORMAT)));
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<ErrorResponse> handleInternalServerError(Exception ex) {
    return buildResponse(
        INTERNAL_SERVER_ERROR, List.of(buildError(ErrorKey.INTERNAL_SERVER_ERROR)));
  }

  private ApiError mapValidationError(FieldError error) {
    final var params = new HashMap<String, Object>();
    params.put("field", error.getField());
    params.put("rejectedValue", error.getRejectedValue());

    return buildError(
        ErrorKey.VALIDATION_FAILED,
        params,
        error.getField(),
        error.getDefaultMessage());
  }

  private ApiError mapDataIntegrityViolation(DataIntegrityViolationException ex) {
    final var causeMessage = ex.getMostSpecificCause().getMessage();
    if (causeMessage != null) {
      final var matcher = POSTGRES_UNIQUE_CONSTRAINT.matcher(causeMessage);
      if (matcher.find()) {
        final var field = matcher.group(1);
        final var value = matcher.group(2);
        final var params = new HashMap<String, Object>();
        params.put("field", field);
        params.put("value", value);
        return buildError(ErrorKey.DATA_DUPLICATE_VALUE, params, field, value);
      }
    }
    return buildError(ErrorKey.DATA_INTEGRITY_VIOLATION);
  }

  private ResponseEntity<ErrorResponse> buildResponse(
      HttpStatus status, List<ApiError> errors) {
    return ResponseEntity.status(status).body(ErrorResponse.of(status, errors));
  }

  private ApiError buildError(ErrorKey errorKey) {
    return buildError(errorKey, Map.of());
  }

  private ApiError buildError(ErrorKey errorKey, Map<String, Object> params, Object... args) {
    final var message = messageUtils.getMessage(errorKey, args);
    final var nonEmptyParams = params == null || params.isEmpty() ? null : params;
    return ApiError.builder().code(errorKey.getKey()).message(message).params(nonEmptyParams).build();
  }

  private HttpStatus resolveStatus(ErrorKey errorKey) {
    return switch (errorKey) {
      case RESOURCE_NOT_FOUND,
          USER_NOT_FOUND_BY_USERNAME,
          USER_NOT_FOUND_BY_EMAIL,
          CERTIFICATE_NOT_FOUND,
          PASSWORD_RESET_TOKEN_MISSING,
          ACCOUNT_ACTIVATION_NOTFOUND -> NOT_FOUND;
      case VALIDATION_FAILED,
          REQUEST_PAYLOAD_INVALID,
          INVALID_ARGUMENT,
          INVALID_FORMAT,
          PASSWORD_RESET_TOKEN_INVALID,
          REGISTRATION_ERROR,
          REGISTRATION_REQUEST_NULL -> BAD_REQUEST;
      case AUTH_CREDENTIALS_INVALID,
          USER_EMAIL_NOT_VERIFIED,
          AUTHENTICATION_FAILED -> UNAUTHORIZED;
      case ACCESS_DENIED -> FORBIDDEN;
      case DATA_INTEGRITY_VIOLATION, DATA_DUPLICATE_VALUE, USER_ALREADY_ACTIVATED -> CONFLICT;
      default -> INTERNAL_SERVER_ERROR;
    };
  }

  public record ErrorResponse(LocalDateTime timestamp, int status, List<ApiError> errors) {
    public static ErrorResponse of(HttpStatus status, List<ApiError> errors) {
      return new ErrorResponse(LocalDateTime.now(), status.value(), errors);
    }
  }
}
