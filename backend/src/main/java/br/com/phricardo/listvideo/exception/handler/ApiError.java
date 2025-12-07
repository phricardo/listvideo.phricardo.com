package br.com.phricardo.listvideo.exception.handler;

import java.util.Map;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ApiError {
  private String code;
  private String message;
  private Map<String, Object> params;
}
