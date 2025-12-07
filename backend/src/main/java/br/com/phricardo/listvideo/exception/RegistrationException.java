package br.com.phricardo.listvideo.exception;

import br.com.phricardo.listvideo.exception.handler.ErrorKey;
import java.util.Map;

public class RegistrationException extends ApiException {
  public RegistrationException(String message) {
    super(ErrorKey.REGISTRATION_ERROR, Map.of("detail", message));
  }

  public RegistrationException() {
    super(ErrorKey.REGISTRATION_ERROR);
  }
}
