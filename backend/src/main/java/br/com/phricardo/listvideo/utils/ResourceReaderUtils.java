package br.com.phricardo.listvideo.utils;


import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.charset.Charset;

import static java.nio.charset.StandardCharsets.UTF_8;
import static org.springframework.core.io.ResourceLoader.CLASSPATH_URL_PREFIX;
import static org.springframework.util.StreamUtils.copyToByteArray;

@Component
@RequiredArgsConstructor
public class ResourceReaderUtils {

    private final ResourceLoader resourceLoader;

    public String readString(final String classpathLocation) {
        return readString(classpathLocation, UTF_8);
    }

    public String readString(final String classpathLocation, final Charset charset) {
        try (var is =
                     resourceLoader.getResource(CLASSPATH_URL_PREFIX + classpathLocation).getInputStream()) {
            return new String(copyToByteArray(is), charset);
        } catch (final IOException e) {
            throw new RuntimeException("Failed to read resource as string: " + classpathLocation, e);
        }
    }

    public byte[] readBytes(final String classpathLocation) {
        try (var is =
                     resourceLoader.getResource(CLASSPATH_URL_PREFIX + classpathLocation).getInputStream()) {
            return copyToByteArray(is);
        } catch (final IOException e) {
            throw new RuntimeException("Failed to read resource: " + classpathLocation, e);
        }
    }
}