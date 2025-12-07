package br.com.phricardo.listvideo.exception;

import br.com.phricardo.listvideo.exception.handler.ErrorKey;
import java.util.Map;

public class LoginException extends ApiException {
  public LoginException(String message) {
    super(ErrorKey.AUTH_CREDENTIALS_INVALID, Map.of("detail", message));
  }

  public LoginException() {
    super(ErrorKey.AUTH_CREDENTIALS_INVALID);
  }
}
