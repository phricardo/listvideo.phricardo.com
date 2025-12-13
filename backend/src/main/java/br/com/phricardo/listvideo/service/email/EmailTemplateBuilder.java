package br.com.phricardo.listvideo.service.email;

import java.util.Optional;
import org.springframework.stereotype.Component;

@Component
public class EmailTemplateBuilder {

  private static final String ACTION_EMAIL_TEMPLATE =
      """
      <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.6;">
        <p style="margin: 0 0 12px 0;">Hello %s,</p>
        <p style="margin: 0 0 18px 0;">%s</p>
        <p style="margin: 24px 0;">
          <a href="%s" style="display: inline-block; padding: 12px 18px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600;">%s</a>
        </p>
        <p style="margin: 0;">If you didn't request this action, you can ignore this email.</p>
      </div>
      """;

  public String buildActionEmail(
      String userName, String content, String actionLabel, String actionLink) {
    final var resolvedName =
        Optional.ofNullable(userName).filter(text -> !text.isBlank()).orElse("there");
    final var resolvedContent = Optional.ofNullable(content).orElse("");
    final var resolvedActionLabel =
        Optional.ofNullable(actionLabel).filter(text -> !text.isBlank()).orElse("Open link");
    final var resolvedActionLink =
        Optional.ofNullable(actionLink).filter(text -> !text.isBlank()).orElse("#");

    return ACTION_EMAIL_TEMPLATE.formatted(
        resolvedName, resolvedContent, resolvedActionLink, resolvedActionLabel);
  }
}
