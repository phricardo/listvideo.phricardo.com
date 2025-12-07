package br.com.phricardo.listvideo.dto.update;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Schema(title = "User Forgot Password Request")
public class UserForgotPasswordRequestDTO {

  @NotBlank(message = "token is required")
  private String token;

  @NotBlank(message = "password is required")
  @Pattern(
      regexp = "^(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+])[a-zA-Z\\d!@#$%^&*()_+]{8,}$",
      message = "password invalid")
  @Schema(description = "Password", example = "Ab*1example")
  private String newPassword;
}
