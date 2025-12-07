package br.com.phricardo.listvideo.controller.doc;

import br.com.phricardo.listvideo.dto.request.CertificateDataRequestDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

@Tag(name = "Certificate", description = "Endpoints for certificates")
public interface CertificateControllerDoc {

  @Operation(
      summary = "Get Certificate by ID",
      description = "Retrieves a certificate by its ID and username.")
  ResponseEntity<Resource> getCertificateByCourseId(
      @PathVariable String certificateId, @PathVariable String username);

  @Operation(
      summary = "Generate Certificate",
      description = "Generates a certificate based on the provided data.")
  @SecurityRequirement(name = "bearer-key")
  ResponseEntity<Resource> generateCertificate(
      @RequestBody @Valid CertificateDataRequestDTO certificateDataRequestDTO);
}
