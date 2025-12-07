package br.com.phricardo.listvideo.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Schema(title = "Certificate Data Request")
public class CertificateDataRequestDTO {

  @NotBlank(message = "courseId is required")
  private String playlistId;

  @NotNull(message = "duration is required")
  @Positive(message = "duration must be the total time of the content in seconds")
  private Integer durationInSeconds;
}
