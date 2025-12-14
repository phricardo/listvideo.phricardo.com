package br.com.phricardo.listvideo.service.email;

import java.util.Locale;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
@RequiredArgsConstructor
public class EmailTemplateBuilder {

  private static final String ACTION_EMAIL_TEMPLATE =
      """
      <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.6;">
        <p style="margin: 0 0 12px 0;">%s</p>
        <p style="margin: 0 0 18px 0;">%s</p>
        <p style="margin: 24px 0;">
          <a href="%s" style="display: inline-block; padding: 12px 18px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600;">%s</a>
        </p>
        <p style="margin: 0;">%s</p>
      </div>
      """;

  private final MessageSource messageSource;

  public String buildActionEmail(
      String userName, String content, String actionLabel, String actionLink, Locale locale) {
    final var resolvedLocale = resolveLocale(locale);
    final var hasName = StringUtils.hasText(userName);
    final var greetingKey =
        hasName ? "email.action.greeting.named" : "email.action.greeting.generic";
    final var greetingArgs = hasName ? new Object[] {userName.trim()} : null;
    final var greeting = messageSource.getMessage(greetingKey, greetingArgs, resolvedLocale);

    final var resolvedContent = Optional.ofNullable(content).orElse("");
    final var resolvedActionLabel =
        Optional.ofNullable(actionLabel)
            .filter(StringUtils::hasText)
            .orElseGet(
                () ->
                    messageSource.getMessage(
                        "email.action.defaultActionLabel", null, resolvedLocale));

    final var resolvedActionLink =
        Optional.ofNullable(actionLink).filter(StringUtils::hasText).orElse("#");

    final var footer =
        messageSource.getMessage("email.action.footer", null, resolvedLocale);

    return ACTION_EMAIL_TEMPLATE.formatted(
        greeting, resolvedContent, resolvedActionLink, resolvedActionLabel, footer);
  }

  private Locale resolveLocale(Locale locale) {
    return Optional.ofNullable(locale).orElse(Locale.ENGLISH);
  }
}
