package br.com.phricardo.listvideo.configuration.mailgun;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "feign.client.mailgun")
public class MailgunProperties {

    private String apiKey;
    private String username;
}
