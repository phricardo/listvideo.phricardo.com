package br.com.phricardo.listvideo.model;

import static jakarta.persistence.GenerationType.IDENTITY;
import static lombok.AccessLevel.PRIVATE;

import br.com.phricardo.listvideo.annotation.ip.setter.IP;
import br.com.phricardo.listvideo.annotation.ip.setter.IpClientListener;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Collections;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
@Entity(name = "User")
@Table(name = "users")
@EntityListeners({AuditingEntityListener.class, IpClientListener.class})
public class User implements UserDetails {

  @Id
  @Column(name = "id")
  @GeneratedValue(strategy = IDENTITY)
  private Long id;

  @Column(name = "user_id", nullable = false)
  private String userId;

  @Column(name = "name", nullable = false)
  private String name;

  @Column(name = "email", nullable = false, unique = true)
  private String email;

  @Column(name = "username", nullable = false, unique = true)
  private String username;

  @Column(name = "password", nullable = false)
  private String password;

  @Lob
  @Column(name = "avatar")
  private String avatar;

  @Column(
      name = "is_account_activated",
      nullable = false,
      columnDefinition = "boolean default false")
  private Boolean isAccountActivated;

  @Column(
      name = "is_verified_account",
      nullable = false,
      columnDefinition = "boolean default false")
  private Boolean isVerifiedAccount;

  @CreatedDate
  @Setter(PRIVATE)
  @Column(name = "created_at")
  private LocalDateTime createdAt;

  @LastModifiedDate
  @Setter(PRIVATE)
  @Column(name = "updated_at")
  private LocalDateTime updatedAt;

  @IP
  @Setter(PRIVATE)
  @Column(name = "ip_address")
  private String ipAddress;

  @PrePersist
  private void generateResourceId() {
    this.userId = UUID.randomUUID().toString();
  }

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return Collections.singleton(new SimpleGrantedAuthority("ROLE_USER"));
  }

  @Override
  public boolean isAccountNonExpired() {
    return true;
  }

  @Override
  public boolean isAccountNonLocked() {
    return true;
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return true;
  }

  @Override
  public boolean isEnabled() {
    return true;
  }
}
