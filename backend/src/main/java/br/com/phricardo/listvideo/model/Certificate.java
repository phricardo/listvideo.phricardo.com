package br.com.phricardo.listvideo.model;

import static jakarta.persistence.FetchType.LAZY;
import static jakarta.persistence.GenerationType.IDENTITY;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
@Entity(name = "Certificate")
@Table(name = "certificates")
@EntityListeners(AuditingEntityListener.class)
public class Certificate {

  @Id
  @Column(name = "id")
  @GeneratedValue(strategy = IDENTITY)
  private Long id;

  @Column(name = "certificate_id", nullable = false)
  private String certificateId;

  @ManyToOne(fetch = LAZY)
  @JoinColumn(name = "username", referencedColumnName = "username", nullable = false)
  private User user;

  @Column(name = "playlist_id", nullable = false)
  private String playlistId;

  @Column(name = "duration_in_seconds", nullable = false)
  private Integer durationInSeconds;

  @CreatedDate
  @Column(name = "created_at", nullable = false)
  private LocalDateTime createdAt;

  @LastModifiedDate
  @Column(name = "updated_at", nullable = false)
  private LocalDateTime updatedAt;

  @PrePersist
  private void generateCertificateId() {
    this.certificateId = UUID.randomUUID().toString().replace("-", "");
  }
}
