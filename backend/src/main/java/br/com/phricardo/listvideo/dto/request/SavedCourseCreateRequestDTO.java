package br.com.phricardo.listvideo.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Schema(title = "Saved Course Create Request")
public class SavedCourseCreateRequestDTO {

  @NotBlank private String youtubePlaylistId;

  @NotBlank private String youtubeChannelId;

  @NotBlank private String youtubeChannelTitle;

  @NotBlank
  @Size(max = 255)
  private String customTitle;

  @NotBlank private String category;

  @NotBlank private String iconKey;
}
