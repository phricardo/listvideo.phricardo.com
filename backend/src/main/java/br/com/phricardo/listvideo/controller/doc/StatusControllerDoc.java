package br.com.phricardo.listvideo.controller.doc;

import br.com.phricardo.listvideo.dto.response.FeatureFlagsResponseDTO;
import br.com.phricardo.listvideo.dto.response.HealthStatusResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Status", description = "Application health and feature availability")
public interface StatusControllerDoc {

  @Operation(summary = "Health check", description = "Returns UP when the API is reachable.")
  HealthStatusResponseDTO healthCheck();

  @Operation(
      summary = "Feature toggles",
      description = "Returns frontend-facing feature availability flags.")
  FeatureFlagsResponseDTO featureFlags();
}
