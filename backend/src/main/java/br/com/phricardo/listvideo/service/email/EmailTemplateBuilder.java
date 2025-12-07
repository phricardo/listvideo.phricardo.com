package br.com.phricardo.listvideo.service.email;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;
import org.springframework.util.StreamUtils;

@Component
@RequiredArgsConstructor
public class EmailTemplateBuilder {

  private final ResourceLoader resourceLoader;
  private String template;
  private String name;
  private String body;
  private String linkUrl;
  private String linkText;

  public EmailTemplateBuilder setTemplate(String location) {
    Resource resource = resourceLoader.getResource("classpath:templates/" + location);
    try (InputStream inputStream = resource.getInputStream()) {
      byte[] bytes = StreamUtils.copyToByteArray(inputStream);
      this.template = new String(bytes, StandardCharsets.UTF_8);
    } catch (IOException e) {
      throw new RuntimeException("Failed to load email template from location: " + location, e);
    }
    return this;
  }

  public EmailTemplateBuilder setName(String name) {
    this.name = name;
    return this;
  }

  public EmailTemplateBuilder setBody(String body) {
    this.body = body;
    return this;
  }

  public EmailTemplateBuilder setLinkText(String linkText) {
    this.linkText = linkText;
    return this;
  }

  public EmailTemplateBuilder setLinkUrl(String linkUrl) {
    this.linkUrl = linkUrl;
    return this;
  }

  public String build() {
    String format = "dd/MM/yyyy HH:mm";
    DateTimeFormatter formatter =
        DateTimeFormatter.ofPattern(format).withZone(ZoneId.systemDefault());
    String formattedDateTime = formatter.format(Instant.now());

    return this.template
        .replaceAll("\\{\\{name\\}\\}", this.name)
        .replaceAll("\\{\\{body\\}\\}", this.body)
        .replaceAll("\\{\\{linkUrl\\}\\}", this.linkUrl)
        .replaceAll("\\{\\{linkText\\}\\}", this.linkText.toUpperCase())
        .replaceAll("\\{\\{date\\}\\}", formattedDateTime);
  }
}
