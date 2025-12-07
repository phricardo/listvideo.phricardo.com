package br.com.phricardo.listvideo.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class ApplicationStatusScheduler {

  @Scheduled(cron = "0 0 0 */7 * *")
  public void logApplicationStatus() {
    log.info("Online application and working");
  }
}
