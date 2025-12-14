package br.com.phricardo.listvideo.service.email;

import java.util.Locale;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class EmailContentResolver {

  private final MessageSource messageSource;

  public LocalizedActionEmailContent getPasswordResetContent(Locale locale) {
    final var resolvedLocale = resolveLocale(locale);
    return new LocalizedActionEmailContent(
        messageSource.getMessage("email.password.reset.subject", null, resolvedLocale),
        messageSource.getMessage("email.password.reset.content", null, resolvedLocale),
        messageSource.getMessage("email.password.reset.actionLabel", null, resolvedLocale));
  }

  public LocalizedActionEmailContent getAccountActivationContent(Locale locale) {
    final var resolvedLocale = resolveLocale(locale);
    return new LocalizedActionEmailContent(
        messageSource.getMessage("email.activation.subject", null, resolvedLocale),
        messageSource.getMessage("email.activation.content", null, resolvedLocale),
        messageSource.getMessage("email.activation.actionLabel", null, resolvedLocale));
  }

  private Locale resolveLocale(Locale locale) {
    return Optional.ofNullable(locale).orElse(Locale.ENGLISH);
  }

  public record LocalizedActionEmailContent(String subject, String content, String actionLabel) {}
}
