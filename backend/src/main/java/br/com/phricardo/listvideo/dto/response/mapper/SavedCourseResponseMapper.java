package br.com.phricardo.listvideo.dto.response.mapper;

import br.com.phricardo.listvideo.dto.response.SavedCourseResponseDTO;
import br.com.phricardo.listvideo.model.SavedCourse;
import org.springframework.stereotype.Component;

@Component
public class SavedCourseResponseMapper {

  public SavedCourseResponseDTO from(SavedCourse entity) {
    return new SavedCourseResponseDTO(
        entity.getId(),
        entity.getUserId(),
        entity.getYoutubePlaylistId(),
        entity.getYoutubeChannelId(),
        entity.getYoutubeChannelTitle(),
        entity.getCustomTitle(),
        entity.getCategory(),
        entity.getIconKey(),
        entity.getCreatedAt(),
        entity.getUpdatedAt());
  }
}
