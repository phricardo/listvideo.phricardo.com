package br.com.phricardo.listvideo.service.email;

import java.util.Arrays;
import java.util.Locale;
import org.springframework.util.StringUtils;

public enum EmailLanguage {
  EN(Locale.ENGLISH, "en", "en-us", "en_us"),
  PT_BR(Locale.forLanguageTag("pt-BR"), "pt", "pt-br", "pt_br", "ptbr");

  private final Locale locale;
  private final String[] aliases;

  EmailLanguage(Locale locale, String... aliases) {
    this.locale = locale;
    this.aliases = aliases;
  }

  public static EmailLanguage fromCode(String code) {
    final var normalizedCode = normalize(code);
    return Arrays.stream(values())
        .filter(language -> Arrays.stream(language.aliases).anyMatch(normalizedCode::equals))
        .findFirst()
        .orElse(EN);
  }

  private static String normalize(String code) {
    if (!StringUtils.hasText(code)) {
      return "";
    }
    return code.toLowerCase().replace('_', '-');
  }

  public Locale getLocale() {
    return locale;
  }
}
