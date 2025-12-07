package br.com.phricardo.listvideo.exception;

import br.com.phricardo.listvideo.exception.handler.ErrorKey;
import java.util.Map;

public class UserActivationException extends ApiException {
  public UserActivationException(String message) {
    super(ErrorKey.USER_ALREADY_ACTIVATED, Map.of("detail", message));
  }

  public UserActivationException() {
    super(ErrorKey.USER_ALREADY_ACTIVATED);
  }
}
