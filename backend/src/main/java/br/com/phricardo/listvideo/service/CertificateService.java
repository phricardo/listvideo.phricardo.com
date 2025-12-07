package br.com.phricardo.listvideo.service;

import static java.util.Objects.isNull;

import br.com.phricardo.listvideo.dto.request.CertificateDataRequestDTO;
import br.com.phricardo.listvideo.dto.request.mapper.CertificateDataRequestMapper;
import br.com.phricardo.listvideo.exception.ApiException;
import br.com.phricardo.listvideo.exception.handler.ErrorKey;
import br.com.phricardo.listvideo.model.Certificate;
import br.com.phricardo.listvideo.repository.CertificateRepository;
import br.com.phricardo.listvideo.service.certificate.CertificateResourceBuilder;
import java.util.Map;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CertificateService {

  private final CertificateResourceBuilder certificateResourceBuilder;
  private final CertificateRepository certificateRepository;
  private final CertificateDataRequestMapper certificateDataRequestMapper;
  private final UserAuthenticationService userAuthenticationService;

  public ResponseEntity<Resource> generateCertificate(
      @NonNull final CertificateDataRequestDTO certificateDataRequestDTO) {
    final var user = userAuthenticationService.getCurrentUser();
    final var new_certificate = certificateDataRequestMapper.from(certificateDataRequestDTO, user);
    Certificate certificate =
        certificateRepository.findByPlaylistIdAndUsername(
            new_certificate.getPlaylistId(), user.getUsername());

    if (isNull(certificate)) certificate = certificateRepository.save(new_certificate);

    return certificateResourceBuilder.buildCertificateResource(certificate, user);
  }

  public ResponseEntity<Resource> getCertificate(String certificateId, String username) {
    final var user = userAuthenticationService.getUserByUsername(username);
    Certificate certificate =
        certificateRepository.findByCertificateIdAndUsername(certificateId, username);

    if (isNull(certificate))
      throw new ApiException(
          ErrorKey.CERTIFICATE_NOT_FOUND, Map.of("certificateId", certificateId), certificateId);

    return certificateResourceBuilder.buildCertificateResource(certificate, user);
  }
}
