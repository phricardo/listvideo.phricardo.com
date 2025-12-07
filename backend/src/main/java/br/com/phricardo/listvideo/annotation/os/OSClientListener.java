package br.com.phricardo.listvideo.annotation.os;

import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.servlet.http.HttpServletRequest;
import java.lang.reflect.Field;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class OSClientListener {

  private final HttpServletRequest request;

  @Autowired
  public OSClientListener(HttpServletRequest request) {
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
        if (field.isAnnotationPresent(OS.class)) {
          field.setAccessible(true);
          String os = request.getHeader("User-Agent");
          if (os.contains("Windows")) {
            field.set(obj, "Windows");
          } else if (os.contains("Mac")) {
            field.set(obj, "Mac");
          } else if (os.contains("Linux")) {
            field.set(obj, "Linux");
          } else if (os.contains("Android")) {
            field.set(obj, "Android");
          } else {
            field.set(obj, "Unknown");
          }
        }
      }
    } catch (IllegalAccessException e) {
      log.error("Error setting the OS field", e);
    }
  }
}
