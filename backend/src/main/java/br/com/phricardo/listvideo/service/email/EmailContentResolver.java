package br.com.phricardo.listvideo.service.email;

import java.util.Locale;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import br.com.phricardo.listvideo.utils.MessageUtils;

@Component
@RequiredArgsConstructor
public class EmailContentResolver {

  private final MessageUtils messageUtils;

  public LocalizedActionEmailContent getPasswordResetContent(final Locale locale) {
    return new LocalizedActionEmailContent(
        messageUtils.getMessage("email.password.reset.subject", locale),
        messageUtils.getMessage("email.password.reset.content", locale),
        messageUtils.getMessage("email.password.reset.actionLabel", locale)
    );
  }

  public LocalizedActionEmailContent getAccountActivationContent(final Locale locale) {
    return new LocalizedActionEmailContent(
        messageUtils.getMessage("email.activation.subject", locale),
        messageUtils.getMessage("email.activation.content", locale),
        messageUtils.getMessage("email.activation.actionLabel", locale)
    );
  }

  public record LocalizedActionEmailContent(
      String subject,
      String content,
      String actionLabel
  ) {}
}
