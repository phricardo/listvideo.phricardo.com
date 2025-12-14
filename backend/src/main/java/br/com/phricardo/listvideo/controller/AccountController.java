package br.com.phricardo.listvideo.controller;

import br.com.phricardo.listvideo.controller.doc.AccountControllerDoc;
import br.com.phricardo.listvideo.dto.response.UserForgotPasswordResponseDTO;
import br.com.phricardo.listvideo.dto.response.UserResponseDTO;
import br.com.phricardo.listvideo.dto.update.UserForgotPasswordRequestDTO;
import br.com.phricardo.listvideo.service.UserAuthenticationService;
import br.com.phricardo.listvideo.service.UserForgotPasswordService;
import br.com.phricardo.listvideo.service.email.EmailLanguage;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/v1/account")
public class AccountController implements AccountControllerDoc {

  private final UserAuthenticationService service;
  private final UserForgotPasswordService userForgotPasswordService;

  @PatchMapping("/activation/{userId}")
  public UserResponseDTO activeAccount(@PathVariable String userId) {
    return service.activateAccount(userId);
  }

  @PostMapping("/activation/resend")
  public void accountActivationEmailResend(
      @RequestParam("email") String email,
      @RequestParam(value = "language", required = false) String language) {
    service.accountActivationEmailResend(email, EmailLanguage.fromCode(language));
  }

  @PostMapping("/password/forgot")
  public void sendPasswordResetLink(
      @RequestParam("email") String email,
      @RequestParam(value = "language", required = false) String language) {
    userForgotPasswordService.sendPasswordResetLink(email, EmailLanguage.fromCode(language));
  }

  @PostMapping("/password/reset")
  public UserForgotPasswordResponseDTO resetUserPassword(
      @RequestBody @Valid UserForgotPasswordRequestDTO userForgotPasswordRequestDTO) {
    return userForgotPasswordService.resetUserPassword(userForgotPasswordRequestDTO);
  }
}
