package br.com.phricardo.listvideo.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import br.com.phricardo.listvideo.dto.request.SavedCourseCreateRequestDTO;
import br.com.phricardo.listvideo.dto.response.mapper.SavedCourseResponseMapper;
import br.com.phricardo.listvideo.dto.update.SavedCourseUpdateRequestDTO;
import br.com.phricardo.listvideo.exception.ApiException;
import br.com.phricardo.listvideo.exception.handler.ErrorKey;
import br.com.phricardo.listvideo.repository.SavedCourseRepository;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;

@DataJpaTest
@Import({SavedCourseService.class, SavedCourseResponseMapper.class})
class SavedCourseServiceTest {

  private static final String USER = "user-123";

  @Autowired private SavedCourseService service;
  @Autowired private SavedCourseRepository repository;

  @BeforeEach
  void clean() {
    repository.deleteAll();
  }

  @Test
  void shouldUpsertAndAvoidDuplicates() {
    var request =
        new SavedCourseCreateRequestDTO(
            "PL-1", "CH-1", "Channel", "My Title", "backend", "Code");

    var created = service.upsert(USER, request);
    assertThat(created.getCustomTitle()).isEqualTo("My Title");
    assertThat(repository.count()).isEqualTo(1);

    var updatedRequest =
        new SavedCourseCreateRequestDTO(
            "PL-1", "CH-1", "Channel", "Updated Title", "backend", "Terminal");
    var updated = service.upsert(USER, updatedRequest);

    assertThat(updated.getId()).isEqualTo(created.getId());
    assertThat(updated.getCustomTitle()).isEqualTo("Updated Title");
    assertThat(repository.count()).isEqualTo(1);
  }

  @Test
  void shouldRejectAuthorChangeOnUpsert() {
    var request =
        new SavedCourseCreateRequestDTO(
            "PL-2", "CH-1", "Channel", "Title", "backend", "Code");
    service.upsert(USER, request);

    var badRequest =
        new SavedCourseCreateRequestDTO(
            "PL-2", "CH-2", "Another", "Title 2", "backend", "Code");

    assertThatThrownBy(() -> service.upsert(USER, badRequest))
        .isInstanceOf(ApiException.class)
        .extracting("errorKey")
        .isEqualTo(ErrorKey.SAVED_COURSE_AUTHOR_IMMUTABLE);
  }

  @Test
  void shouldEnforceOwnershipOnUpdateAndDelete() {
    var request =
        new SavedCourseCreateRequestDTO(
            "PL-3", "CH-1", "Channel", "Title", "backend", "Code");
    var created = service.upsert(USER, request);

    var updateRequest = new SavedCourseUpdateRequestDTO("New", "frontend", "Video");

    UUID createdId = created.getId();

    assertThatThrownBy(() -> service.update("other-user", createdId, updateRequest))
        .isInstanceOf(ApiException.class)
        .extracting("errorKey")
        .isEqualTo(ErrorKey.ACCESS_DENIED);

    assertThatThrownBy(() -> service.delete("other-user", createdId))
        .isInstanceOf(ApiException.class)
        .extracting("errorKey")
        .isEqualTo(ErrorKey.ACCESS_DENIED);
  }
}
