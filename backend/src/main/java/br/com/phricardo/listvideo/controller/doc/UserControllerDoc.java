package br.com.phricardo.listvideo.controller.doc;

import br.com.phricardo.listvideo.dto.response.UserAvailabilityUsernameResponseDTO;
import br.com.phricardo.listvideo.dto.response.UserResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.PathVariable;

@Tag(name = "User", description = "Endpoints for user")
public interface UserControllerDoc {

  @Operation(
      summary = "Get User by Username",
      description = "Retrieves user information based on the provided username.")
  UserResponseDTO getUserByUsername(@PathVariable String username);

  @Operation(
      summary = "Check Username Availability",
      description = "Verifies if the provided username is already registered.")
  UserAvailabilityUsernameResponseDTO isUsernameRegistered(@PathVariable String username);
}
