package br.com.phricardo.listvideo.controller;

import br.com.phricardo.listvideo.controller.doc.AuthenticationControllerDoc;
import br.com.phricardo.listvideo.dto.request.UserAuthLoginRequestDTO;
import br.com.phricardo.listvideo.dto.request.UserAuthRegisterRequestDTO;
import br.com.phricardo.listvideo.dto.response.TokenResponseDTO;
import br.com.phricardo.listvideo.dto.response.UserResponseDTO;
import br.com.phricardo.listvideo.service.UserAuthenticationService;
import br.com.phricardo.listvideo.service.email.EmailLanguage;
import java.time.Duration;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/v1/auth")
public class AuthenticationController implements AuthenticationControllerDoc {

  private final UserAuthenticationService service;
  private final AuthenticationManager authenticationManager;

  @Value("${app.jwt.expiration-time-in-hours}")
  private Integer jwtExpirationHours;

  @Value("${app.cookie.name:listvideo_token}")
  private String authCookieName;

  @Value("${app.cookie.secure:false}")
  private boolean authCookieSecure;

  @Value("${app.cookie.same-site:Lax}")
  private String authCookieSameSite;

  @PostMapping("/register")
  public UserResponseDTO register(
      @RequestBody @Valid UserAuthRegisterRequestDTO registerRequestDTO,
      @RequestParam(value = "language", required = false) String language) {
    return service.registerUser(registerRequestDTO, EmailLanguage.fromCode(language));
  }

  @PostMapping("/login")
  public ResponseEntity<TokenResponseDTO> login(
      @RequestBody @Valid UserAuthLoginRequestDTO loginRequestDTO) {
    final var tokenResponse = service.loginUser(loginRequestDTO, authenticationManager);

    final var cookie =
        ResponseCookie.from(authCookieName, tokenResponse.getToken())
            .httpOnly(true)
            .secure(authCookieSecure)
            .sameSite(authCookieSameSite)
            .path("/")
            .maxAge(Duration.ofHours(jwtExpirationHours))
            .build();

    return ResponseEntity.ok()
        .header(HttpHeaders.SET_COOKIE, cookie.toString())
        .body(tokenResponse);
  }

  @PostMapping("/logout")
  public ResponseEntity<Void> logout() {
    final var deleteCookie =
        ResponseCookie.from(authCookieName, "")
            .httpOnly(true)
            .secure(authCookieSecure)
            .sameSite(authCookieSameSite)
            .path("/")
            .maxAge(Duration.ZERO)
            .build();

    return ResponseEntity.noContent()
        .header(HttpHeaders.SET_COOKIE, deleteCookie.toString())
        .build();
  }

  @GetMapping("/authenticated/user")
  public UserResponseDTO getCurrentAuthenticatedUser() {
    return service.getCurrentUserDTO();
  }
}
