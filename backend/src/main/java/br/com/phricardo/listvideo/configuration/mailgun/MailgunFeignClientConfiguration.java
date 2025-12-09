package br.com.phricardo.listvideo.configuration.mailgun;

import feign.auth.BasicAuthRequestInterceptor;
import feign.codec.Encoder;
import feign.form.spring.SpringFormEncoder;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.ObjectFactory;
import org.springframework.boot.autoconfigure.http.HttpMessageConverters;
import org.springframework.cloud.openfeign.support.SpringEncoder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@RequiredArgsConstructor
@Configuration
public class MailgunFeignClientConfiguration {

    private final MailgunProperties mailgunProperties;

    @Bean
    public Encoder feignFormEncoder(final ObjectFactory<HttpMessageConverters> converters) {
        return new SpringFormEncoder(new SpringEncoder(converters));
    }

    @Bean
    public BasicAuthRequestInterceptor basicAuthRequestInterceptor() {
        final var username =
                Optional.ofNullable(mailgunProperties.getUsername())
                        .filter(value -> !value.isBlank())
                        .orElse("api");
        return new BasicAuthRequestInterceptor(username, mailgunProperties.getApiKey());
    }
}
