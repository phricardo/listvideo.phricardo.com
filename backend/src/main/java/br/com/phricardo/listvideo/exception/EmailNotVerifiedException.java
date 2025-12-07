package br.com.phricardo.listvideo.exception;

import br.com.phricardo.listvideo.exception.handler.ErrorKey;
import java.util.Map;

public class EmailNotVerifiedException extends ApiException {

  public EmailNotVerifiedException(String message) {
    super(ErrorKey.USER_EMAIL_NOT_VERIFIED, Map.of("detail", message));
  }

  public EmailNotVerifiedException() {
    super(ErrorKey.USER_EMAIL_NOT_VERIFIED);
  }
}
