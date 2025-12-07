package br.com.phricardo.listvideo.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Schema(title = "User Response")
public class UserResponseDTO {

  private String userId;
  private String name;
  private String username;
  private String avatar;
  private Boolean isVerifiedAccount;
}
