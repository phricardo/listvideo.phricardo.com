package br.com.phricardo.listvideo.repository;

import br.com.phricardo.listvideo.model.User;
import br.com.phricardo.listvideo.model.UserPasswordResetToken;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserPasswordResetTokenRepository
    extends JpaRepository<UserPasswordResetToken, Long> {
  Optional<UserPasswordResetToken> findByToken(String token);

  Optional<UserPasswordResetToken> findByUser(User user);
}
