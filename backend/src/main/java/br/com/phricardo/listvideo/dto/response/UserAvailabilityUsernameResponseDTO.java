package br.com.phricardo.listvideo.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Schema(title = "User Availability Username Response")
public class UserAvailabilityUsernameResponseDTO {

  private String username;
  private boolean availability;
}
