package br.com.phricardo.listvideo.repository;

import br.com.phricardo.listvideo.model.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Repository;

@Repository
public interface UserAuthRepository extends JpaRepository<User, Long> {

  UserDetails findByEmailOrUsername(String email, String username);

  boolean existsByEmailOrUsername(String email, String username);

  Optional<User> findByUserIdAndIsAccountActivatedFalse(String userId);

  Optional<User> findByUsername(String username);

  Optional<User> findByEmail(String email);
}
