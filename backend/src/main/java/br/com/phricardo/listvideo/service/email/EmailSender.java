package br.com.phricardo.listvideo.service.email;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class EmailSender {

  private final JavaMailSender javaMailSender;

  private String recipient;
  private String subject;
  private String body;
  private boolean isHtml;

  public EmailSender setRecipient(String recipient) {
    this.recipient = recipient;
    return this;
  }

  public EmailSender setSubject(String subject) {
    this.subject = subject;
    return this;
  }

  public EmailSender setBody(String value, boolean isHtml) {
    this.body = value;
    this.isHtml = isHtml;
    return this;
  }

  public MimeMessage build() throws MessagingException {
    MimeMessage message = javaMailSender.createMimeMessage();
    MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
    helper.setTo(recipient);
    helper.setSubject(subject);
    helper.setText(body, isHtml);

    helper.getMimeMessage().setHeader("X-Unsent", "1");
    helper.getMimeMessage().setHeader("X-Auto-Response-Suppress", "All");

    ClassPathResource imageResource = new ClassPathResource("templates/listvideo.png");
    helper.addInline("logo", imageResource, "image/png");

    return message;
  }

  public void send() {
    try {
      MimeMessage message = build();
      javaMailSender.send(message);
    } catch (MessagingException e) {
      throw new RuntimeException("Error sending email", e);
    }
  }
}
