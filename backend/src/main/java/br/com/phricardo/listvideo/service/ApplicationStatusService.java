package br.com.phricardo.listvideo.service;

import br.com.phricardo.listvideo.dto.response.FeatureFlagsResponseDTO;
import br.com.phricardo.listvideo.dto.response.HealthStatusResponseDTO;
import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class ApplicationStatusService {

  @Value("${app.features.password_reset_email.enabled:false}")
  private boolean passwordResetEmailEnabled;

  @Value("${app.features.activation_resend_email.enabled:false}")
  private boolean activationResendEmailEnabled;

  public HealthStatusResponseDTO getHealthStatus() {
    return HealthStatusResponseDTO.builder().status("UP").build();
  }

  public FeatureFlagsResponseDTO getFeatureFlags() {
    Map<String, Boolean> flags = new HashMap<>();
    flags.put("password_reset_email", passwordResetEmailEnabled);
    flags.put("activation_resend_email", activationResendEmailEnabled);
    return FeatureFlagsResponseDTO.builder().features(flags).build();
  }
}
