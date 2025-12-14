package br.com.phricardo.listvideo.service.email;

import br.com.phricardo.listvideo.client.MailgunFeignClient;
import br.com.phricardo.listvideo.dto.request.mapper.MailgunRequestMapper;
import br.com.phricardo.listvideo.model.EmailNotification;
import br.com.phricardo.listvideo.utils.ResourceReaderUtils;
import feign.form.FormData;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.Year;

@Slf4j
@Component
@RequiredArgsConstructor
public class SendNotification {

    private final ResourceReaderUtils resourceReader;
    private final MailgunFeignClient mailgunFeignClient;
    private final MailgunRequestMapper mailgunRequestMapper;

    private static final String INLINE_LOGO_CONTENT_TYPE = "image/png";
    private static final String INLINE_LOGO_FILENAME = "footer-logo.png";
    private static final String INLINE_LOGO_PATH = "assets/footer-logo.png";
    private static final String EMAIL_BASE_TEMPLATE = "assets/email-template.html";

    @Value("${services.mailgun.email.domain}")
    private String domain;

    @Value("${services.mailgun.email.from-address}")
    private String fromAddress;


    public void send(final EmailNotification emailNotification) {
        final var template = resourceReader.readString(EMAIL_BASE_TEMPLATE);
        final var request = mailgunRequestMapper.toRequest(emailNotification);

        final var inlineLogo = loadInlineLogo();

        final var response =
                mailgunFeignClient.sendMessage(
                        domain,
                        fromAddress,
                        request.getTo(),
                        request.getSubject(),
                        wrap(request.getSubject(), request.getHtmlContent(), template),
                        inlineLogo);

        log.info("Mailgun e-mail response: id={}, message={}", response.getId(), response.getMessage());
    }

    private FormData loadInlineLogo() {
        try {
            return new FormData(
                    INLINE_LOGO_CONTENT_TYPE,
                    INLINE_LOGO_FILENAME,
                    resourceReader.readBytes(INLINE_LOGO_PATH));
        } catch (RuntimeException ex) {
            log.warn("Inline logo not found or unreadable; sending e-mail without inline image.", ex);
            return null;
        }
    }

    private String wrap(final String title, final String innerHtml, final String templateEmail) {
        final var year = String.valueOf(Year.now().getValue());
        return templateEmail.formatted(title, innerHtml, year);
    }
}
