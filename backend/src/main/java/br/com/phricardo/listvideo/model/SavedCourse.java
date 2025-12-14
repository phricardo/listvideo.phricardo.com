package br.com.phricardo.listvideo.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Data
@Entity
@Table(
    name = "saved_courses",
    uniqueConstraints =
        {@jakarta.persistence.UniqueConstraint(name = "uq_saved_course_user_playlist", columnNames = {"user_id", "youtube_playlist_id"})})
@EqualsAndHashCode(of = "id")
public class SavedCourse {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column(name = "user_id", nullable = false)
  private String userId;

  @Column(name = "youtube_playlist_id", nullable = false)
  private String youtubePlaylistId;

  @Column(name = "youtube_channel_id", nullable = false)
  private String youtubeChannelId;

  @Column(name = "youtube_channel_title", nullable = false)
  private String youtubeChannelTitle;

  @Column(name = "custom_title", nullable = false)
  private String customTitle;

  @Column(name = "category", nullable = false)
  private String category;

  @Column(name = "icon_key", nullable = false)
  private String iconKey;

  @CreationTimestamp
  @Column(name = "created_at", nullable = false, updatable = false)
  private LocalDateTime createdAt;

  @UpdateTimestamp
  @Column(name = "updated_at", nullable = false)
  private LocalDateTime updatedAt;

  public void applyEditableFields(String customTitle, String category, String iconKey) {
    this.customTitle = customTitle;
    this.category = category;
    this.iconKey = iconKey;
  }
}
