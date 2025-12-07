package br.com.phricardo.listvideo.exception;

import br.com.phricardo.listvideo.exception.handler.ErrorKey;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import lombok.Getter;

@Getter
public class ApiException extends RuntimeException {

  private final ErrorKey errorKey;
  private final Map<String, Object> params;
  private final transient Object[] messageParams;

  public ApiException(final ErrorKey errorKey, final Object... messageParams) {
    this(errorKey, Collections.emptyMap(), messageParams);
  }

  public ApiException(
      final ErrorKey errorKey,
      final Map<String, Object> params,
      final Object... messageParams) {
    super(errorKey.getKey());
    this.errorKey = errorKey;
    this.params =
        Collections.unmodifiableMap(
            new HashMap<>(params == null ? Collections.emptyMap() : params));
    this.messageParams = messageParams;
  }
}
