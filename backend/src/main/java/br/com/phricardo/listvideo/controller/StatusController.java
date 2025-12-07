package br.com.phricardo.listvideo.controller;

import br.com.phricardo.listvideo.controller.doc.StatusControllerDoc;
import br.com.phricardo.listvideo.dto.response.FeatureFlagsResponseDTO;
import br.com.phricardo.listvideo.dto.response.HealthStatusResponseDTO;
import br.com.phricardo.listvideo.service.ApplicationStatusService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/status")
public class StatusController implements StatusControllerDoc {

  private final ApplicationStatusService applicationStatusService;

  @GetMapping("/health")
  public HealthStatusResponseDTO healthCheck() {
    return applicationStatusService.getHealthStatus();
  }

  @GetMapping("/features")
  public FeatureFlagsResponseDTO featureFlags() {
    return applicationStatusService.getFeatureFlags();
  }
}
