package br.com.phricardo.listvideo.client;

import br.com.phricardo.listvideo.configuration.mailgun.MailgunFeignClientConfiguration;
import br.com.phricardo.listvideo.dto.response.MailgunSendResponse;
import feign.form.FormData;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestPart;

import static org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE;

@FeignClient(
        name = "mailgun",
        url = "${feign.client.mailgun.url}",
        configuration = MailgunFeignClientConfiguration.class)
public interface MailgunFeignClient {

    @PostMapping(value = "/v3/{domain}/messages", consumes = MULTIPART_FORM_DATA_VALUE)
    MailgunSendResponse sendMessage(
            @PathVariable("domain") String domain,
            @RequestPart("from") String from,
            @RequestPart("to") String to,
            @RequestPart("subject") String subject,
            @RequestPart("html") String html,
            @RequestPart(value = "inline", required = false) FormData inline);
}
