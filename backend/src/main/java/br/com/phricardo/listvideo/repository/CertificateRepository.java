package br.com.phricardo.listvideo.repository;

import br.com.phricardo.listvideo.model.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, Long> {

  @Query(
      "SELECT c FROM Certificate c WHERE c.playlistId = :playlistId AND c.user.username = :username")
  Certificate findByPlaylistIdAndUsername(String playlistId, String username);

  @Query(
      "SELECT c FROM Certificate c WHERE c.certificateId = :certificateId AND c.user.username = :username")
  Certificate findByCertificateIdAndUsername(String certificateId, String username);
}
