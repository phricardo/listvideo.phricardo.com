package br.com.phricardo.listvideo.annotation.ip.log;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Slf4j
@Aspect
@Component
public class LogClientIPAspect {

  private final HttpServletRequest request;

  @Autowired
  public LogClientIPAspect(HttpServletRequest request) {
    this.request = request;
  }

  @Before("@within(LogClientIP) || @annotation(LogClientIP)")
  public void logClientIP(JoinPoint joinPoint) {
    final String clientIP = request.getRemoteAddr();
    log.info(String.format("Client IP: %s", clientIP));
  }
}
