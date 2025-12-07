package br.com.phricardo.listvideo.controller;

import br.com.phricardo.listvideo.controller.doc.UserControllerDoc;
import br.com.phricardo.listvideo.dto.response.UserAvailabilityUsernameResponseDTO;
import br.com.phricardo.listvideo.dto.response.UserResponseDTO;
import br.com.phricardo.listvideo.service.UserAuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/v1/user")
public class UserController implements UserControllerDoc {

  private final UserAuthenticationService userAuthenticationService;

  @GetMapping("/check-username/{username}")
  public UserAvailabilityUsernameResponseDTO isUsernameRegistered(@PathVariable String username) {
    return userAuthenticationService.isUsernameRegistered(username);
  }

  @GetMapping("/{username}")
  public UserResponseDTO getUserByUsername(@PathVariable String username) {
    return userAuthenticationService.getUserResponseByUsername(username);
  }
}
