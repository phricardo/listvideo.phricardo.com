package br.com.phricardo.listvideo.dto.request.mapper;

import br.com.phricardo.listvideo.dto.request.CertificateDataRequestDTO;
import br.com.phricardo.listvideo.model.Certificate;
import br.com.phricardo.listvideo.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CertificateDataRequestMapper {

  @Mapping(target = "id", ignore = true)
  @Mapping(source = "user", target = "user")
  Certificate from(CertificateDataRequestDTO certificateDataRequestDTO, User user);
}
