package br.com.phricardo.listvideo.utils;

import static org.springframework.context.i18n.LocaleContextHolder.getLocale;

import java.util.Locale;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;

import br.com.phricardo.listvideo.exception.handler.ErrorKey;

@Component
@RequiredArgsConstructor
public class MessageUtils {

  private final MessageSource messageSource;

  // Uso padrão (locale do contexto)
  public String getMessage(final String key, final Object... params) {
    return messageSource.getMessage(key, params, getLocale());
  }

  // Uso explícito (emails, jobs, async)
  public String getMessage(
      final String key,
      final Locale locale,
      final Object... params
  ) {
    return messageSource.getMessage(
        key,
        params,
        locale != null ? locale : getLocale()
    );
  }

  // Mantém compatibilidade com ErrorKey
  public String getMessage(final ErrorKey errorKey, final Object... params) {
    return messageSource.getMessage(errorKey.getKey(), params, getLocale());
  }
}
