package br.com.phricardo.listvideo.dto.response.mapper;

import br.com.phricardo.listvideo.dto.response.TokenResponseDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TokenResponseMapper {

  @Mapping(target = "token", source = "token")
  TokenResponseDTO from(String token);
}
