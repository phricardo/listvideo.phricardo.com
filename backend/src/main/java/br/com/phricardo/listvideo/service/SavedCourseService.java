package br.com.phricardo.listvideo.service;

import br.com.phricardo.listvideo.dto.request.SavedCourseCreateRequestDTO;
import br.com.phricardo.listvideo.dto.response.SavedCourseResponseDTO;
import br.com.phricardo.listvideo.dto.response.mapper.SavedCourseResponseMapper;
import br.com.phricardo.listvideo.dto.update.SavedCourseUpdateRequestDTO;
import br.com.phricardo.listvideo.exception.ApiException;
import br.com.phricardo.listvideo.exception.handler.ErrorKey;
import br.com.phricardo.listvideo.model.SavedCourse;
import br.com.phricardo.listvideo.repository.SavedCourseRepository;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SavedCourseService {

  private final SavedCourseRepository repository;
  private final SavedCourseResponseMapper responseMapper;

  @Transactional
  public SavedCourseResponseDTO upsert(String userId, SavedCourseCreateRequestDTO request) {
    SavedCourse entity =
        repository
            .findByUserIdAndYoutubePlaylistId(userId, request.getYoutubePlaylistId())
            .map(existing -> applyUpdate(existing, request))
            .orElseGet(() -> createNew(userId, request));

    repository.save(entity);
    return responseMapper.from(entity);
  }

  @Transactional
  public SavedCourseResponseDTO update(
      String userId, UUID id, SavedCourseUpdateRequestDTO updateRequest) {
    SavedCourse entity =
        repository
            .findById(id)
            .orElseThrow(() -> new ApiException(ErrorKey.SAVED_COURSE_NOT_FOUND));

    if (!entity.getUserId().equals(userId)) {
      throw new ApiException(ErrorKey.ACCESS_DENIED);
    }

    entity.applyEditableFields(
        updateRequest.getCustomTitle(), updateRequest.getCategory(), updateRequest.getIconKey());

    repository.save(entity);
    return responseMapper.from(entity);
  }

  @Transactional
  public void delete(String userId, UUID id) {
    SavedCourse entity =
        repository
            .findById(id)
            .orElseThrow(() -> new ApiException(ErrorKey.SAVED_COURSE_NOT_FOUND));

    if (!entity.getUserId().equals(userId)) {
      throw new ApiException(ErrorKey.ACCESS_DENIED);
    }

    repository.delete(entity);
  }

  @Transactional(readOnly = true)
  public List<SavedCourseResponseDTO> listByUserId(String userId) {
    return repository.findAllByUserIdOrderByCreatedAtAsc(userId).stream()
        .map(responseMapper::from)
        .toList();
  }

  private SavedCourse createNew(String userId, SavedCourseCreateRequestDTO request) {
    SavedCourse entity = new SavedCourse();
    entity.setUserId(userId);
    entity.setYoutubePlaylistId(request.getYoutubePlaylistId());
    entity.setYoutubeChannelId(request.getYoutubeChannelId());
    entity.setYoutubeChannelTitle(request.getYoutubeChannelTitle());
    entity.applyEditableFields(
        request.getCustomTitle(), request.getCategory(), request.getIconKey());
    return entity;
  }

  private SavedCourse applyUpdate(SavedCourse entity, SavedCourseCreateRequestDTO request) {
    if (!entity.getYoutubeChannelId().equals(request.getYoutubeChannelId())
        || !entity.getYoutubeChannelTitle().equals(request.getYoutubeChannelTitle())) {
      throw new ApiException(ErrorKey.SAVED_COURSE_AUTHOR_IMMUTABLE);
    }
    entity.applyEditableFields(
        request.getCustomTitle(), request.getCategory(), request.getIconKey());
    return entity;
  }
}
