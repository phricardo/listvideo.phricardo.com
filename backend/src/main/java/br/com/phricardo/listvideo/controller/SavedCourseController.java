package br.com.phricardo.listvideo.controller;

import br.com.phricardo.listvideo.dto.request.SavedCourseCreateRequestDTO;
import br.com.phricardo.listvideo.dto.response.SavedCourseResponseDTO;
import br.com.phricardo.listvideo.dto.update.SavedCourseUpdateRequestDTO;
import br.com.phricardo.listvideo.model.User;
import br.com.phricardo.listvideo.service.SavedCourseService;
import br.com.phricardo.listvideo.service.UserAuthenticationService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PatchMapping;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1")
public class SavedCourseController {

  private final SavedCourseService savedCourseService;
  private final UserAuthenticationService userAuthenticationService;

  @PostMapping("/me/saved-courses")
  public ResponseEntity<SavedCourseResponseDTO> upsert(
      @RequestBody @Valid SavedCourseCreateRequestDTO request) {
    User currentUser = userAuthenticationService.getCurrentUser();
    SavedCourseResponseDTO response =
        savedCourseService.upsert(currentUser.getUserId(), request);
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
  }

  @PatchMapping("/me/saved-courses/{id}")
  public SavedCourseResponseDTO update(
      @PathVariable("id") UUID id,
      @RequestBody @Valid SavedCourseUpdateRequestDTO request) {
    User currentUser = userAuthenticationService.getCurrentUser();
    return savedCourseService.update(currentUser.getUserId(), id, request);
  }

  @DeleteMapping("/me/saved-courses/{id}")
  public ResponseEntity<Void> delete(@PathVariable("id") UUID id) {
    User currentUser = userAuthenticationService.getCurrentUser();
    savedCourseService.delete(currentUser.getUserId(), id);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/me/saved-courses")
  public List<SavedCourseResponseDTO> listMine() {
    User currentUser = userAuthenticationService.getCurrentUser();
    return savedCourseService.listByUserId(currentUser.getUserId());
  }

  @GetMapping("/users/{username}/saved-courses")
  public List<SavedCourseResponseDTO> listByUsername(@PathVariable("username") String username) {
    final var user = userAuthenticationService.getUserByUsername(username);
    return savedCourseService.listByUserId(user.getUserId());
  }
}
