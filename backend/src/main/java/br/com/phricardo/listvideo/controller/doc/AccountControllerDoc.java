package br.com.phricardo.listvideo.controller.doc;

import br.com.phricardo.listvideo.dto.response.UserForgotPasswordResponseDTO;
import br.com.phricardo.listvideo.dto.response.UserResponseDTO;
import br.com.phricardo.listvideo.dto.update.UserForgotPasswordRequestDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

@Tag(name = "Account", description = "Endpoints for user account")
public interface AccountControllerDoc {

  @Operation(
      summary = "Activate User Account",
      description = "Activates a user's account based on the provided user ID.")
  UserResponseDTO activeAccount(@PathVariable String userId);

  @Operation(
      summary = "User account activation resend",
      description = "Resend user account activation link to email")
  void accountActivationEmailResend(@RequestParam("email") String email);

  @Operation(
      summary = "Send Password Reset Token",
      description =
          "Generates a password reset token and sends it to the user's email if they are registered.")
  void sendPasswordResetLink(@RequestParam("email") String email);

  @Operation(
      summary = "Reset User Password if Token is Valid",
      description =
          "Resets the user's password in the application based on the validity of the token.")
  UserForgotPasswordResponseDTO resetUserPassword(
      @RequestBody @Valid UserForgotPasswordRequestDTO userForgotPasswordRequestDTO);
}
