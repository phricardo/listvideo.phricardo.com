package br.com.phricardo.listvideo.model;

import static jakarta.persistence.GenerationType.IDENTITY;
import static lombok.AccessLevel.PRIVATE;

import br.com.phricardo.listvideo.annotation.ip.setter.IP;
import br.com.phricardo.listvideo.annotation.ip.setter.IpClientListener;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
@Entity(name = "UserPasswordResetToken")
@Table(name = "users_password_reset_token")
@Builder(toBuilder = true)
@EntityListeners({AuditingEntityListener.class, IpClientListener.class})
public class UserPasswordResetToken {

  @Id
  @Column(name = "id")
  @GeneratedValue(strategy = IDENTITY)
  private Long id;

  private String token;

  @OneToOne(targetEntity = User.class, fetch = FetchType.EAGER)
  @JoinColumn(name = "username", referencedColumnName = "username", nullable = false)
  private User user;

  @Column(name = "expiry_date")
  private LocalDateTime expiryDate;

  @LastModifiedDate
  @Setter(PRIVATE)
  @Column(name = "last_password_reset_date")
  private LocalDateTime lastPasswordResetDate;

  @IP
  @Setter(PRIVATE)
  @Column(name = "ip_address")
  private String ipAddress;

  @Column(name = "password_changed", nullable = false, columnDefinition = "boolean default false")
  private Boolean passwordChanged;
}
