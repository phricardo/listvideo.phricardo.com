package br.com.phricardo.listvideo.controller.doc;

import br.com.phricardo.listvideo.dto.request.UserAuthLoginRequestDTO;
import br.com.phricardo.listvideo.dto.request.UserAuthRegisterRequestDTO;
import br.com.phricardo.listvideo.dto.response.TokenResponseDTO;
import br.com.phricardo.listvideo.dto.response.UserResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

@Tag(name = "Authentication", description = "Endpoints for user authentication and registration")
public interface AuthenticationControllerDoc {

  @Operation(summary = "User Registration", description = "Registers a new user.")
  UserResponseDTO register(
      @RequestBody @Valid UserAuthRegisterRequestDTO registerRequestDTO,
      @RequestParam(value = "language", required = false) String language);

  @Operation(
      summary = "User Login",
      description = "Authenticates a user and returns a JWT token if the credentials are valid.")
  ResponseEntity<TokenResponseDTO> login(@RequestBody @Valid UserAuthLoginRequestDTO loginRequestDTO);

  @Operation(
      summary = "User Logout",
      description = "Clears the authentication cookie and ends the current user session.")
  ResponseEntity<Void> logout();

  @Operation(
      summary = "Get Current Authenticated User",
      description = "Retrieves information about the currently authenticated user.")
  @SecurityRequirement(name = "bearer-key")
  UserResponseDTO getCurrentAuthenticatedUser();
}
