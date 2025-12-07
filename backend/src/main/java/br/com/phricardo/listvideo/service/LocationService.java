package br.com.phricardo.listvideo.service;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@Service
public class LocationService {

  public String buildLocation(final String url) {
    if (url == null) throw new NullPointerException("URL cannot be null");
    return ServletUriComponentsBuilder.fromCurrentContextPath().path("/v2/" + url).toUriString();
  }
}
