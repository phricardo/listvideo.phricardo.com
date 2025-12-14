package br.com.phricardo.listvideo.dto.update;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Schema(title = "Saved Course Update Request")
public class SavedCourseUpdateRequestDTO {

  @NotBlank
  @Size(max = 255)
  private String customTitle;

  @NotBlank private String category;

  @NotBlank private String iconKey;
}
