package br.com.phricardo.listvideo.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Schema(title = "Feature Flags Response")
public class FeatureFlagsResponseDTO {

  private Map<String, Boolean> features;
}
