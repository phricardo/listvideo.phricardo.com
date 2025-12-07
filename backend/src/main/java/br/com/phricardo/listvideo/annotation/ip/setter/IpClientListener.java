package br.com.phricardo.listvideo.annotation.ip.setter;

import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.servlet.http.HttpServletRequest;
import java.lang.reflect.Field;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.beans.factory.aspectj.ConfigurableObject;

@Slf4j
@Configurable
public class IpClientListener implements ConfigurableObject {

  private final HttpServletRequest request;

  @Autowired
  public IpClientListener(HttpServletRequest request) {
    this.request = request;
  }

  @PrePersist
  public void persist(Object obj) {
    execute(obj);
  }

  @PreUpdate
  public void update(Object obj) {
    execute(obj);
  }

  private void execute(Object obj) {
    Field[] fields = obj.getClass().getDeclaredFields();

    try {
      for (Field field : fields) {
        if (field.isAnnotationPresent(IP.class)) {
          field.setAccessible(true);
          String ipAddress = request.getHeader("X-Forwarded-For");
          if (ipAddress == null || ipAddress.isEmpty()) {
            ipAddress = request.getRemoteAddr();
          }
          field.set(obj, ipAddress);
        }
      }
    } catch (IllegalAccessException e) {
      log.error("Error setting the IP address field", e);
    }
  }
}
