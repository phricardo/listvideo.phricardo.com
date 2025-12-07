package br.com.phricardo.listvideo.utils;

import static org.springframework.context.i18n.LocaleContextHolder.getLocale;

import br.com.phricardo.listvideo.exception.handler.ErrorKey;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class MessageUtils {

  private final MessageSource messageSource;

  public String getMessage(final ErrorKey errorKey, final Object... params) {
    return messageSource.getMessage(errorKey.getKey(), params, getLocale());
  }
}
