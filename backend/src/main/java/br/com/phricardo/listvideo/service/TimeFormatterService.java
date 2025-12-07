package br.com.phricardo.listvideo.service;

import org.springframework.stereotype.Service;

@Service
public class TimeFormatterService {

  public static String formatTime(final Integer durationInSeconds) {
    final var hours = durationInSeconds / 3600;
    final var minutes = (durationInSeconds % 3600) / 60;
    final var seconds = durationInSeconds % 60;
    var formattedTime = "";

    if (hours > 0) {
      formattedTime += hours + " hora" + (hours > 1 ? "s" : "") + " ";
    }

    if (minutes > 0) {
      formattedTime += minutes + " minuto" + (minutes > 1 ? "s" : "") + " ";
    }

    if (seconds > 0) {
      formattedTime += seconds + " segundo" + (seconds > 1 ? "s" : "") + " ";
    }

    return formattedTime.trim();
  }
}
