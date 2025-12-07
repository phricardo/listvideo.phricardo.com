package br.com.phricardo.listvideo.controller;

import br.com.phricardo.listvideo.controller.doc.CertificateControllerDoc;
import br.com.phricardo.listvideo.dto.request.CertificateDataRequestDTO;
import br.com.phricardo.listvideo.service.CertificateService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/v1/certificate")
public class CertificateController implements CertificateControllerDoc {

  private final CertificateService certificateService;

  @GetMapping("/{username}/{certificateId}")
  public ResponseEntity<Resource> getCertificateByCourseId(
      @PathVariable String certificateId, @PathVariable String username) {
    return certificateService.getCertificate(certificateId, username);
  }

  @PostMapping
  public ResponseEntity<Resource> generateCertificate(
      @RequestBody @Valid CertificateDataRequestDTO certificateDataRequestDTO) {
    return certificateService.generateCertificate(certificateDataRequestDTO);
  }
}
