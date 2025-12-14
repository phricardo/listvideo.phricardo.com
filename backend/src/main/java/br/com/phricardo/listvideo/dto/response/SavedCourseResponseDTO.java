package br.com.phricardo.listvideo.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Schema(title = "Saved Course Response")
public class SavedCourseResponseDTO {

  private UUID id;
  private String userId;
  private String youtubePlaylistId;
  private String authorChannelId;
  private String authorChannelTitle;
  private String customTitle;
  private String category;
  private String iconKey;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
}
