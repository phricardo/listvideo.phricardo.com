package br.com.phricardo.listvideo.dto.response.mapper;

import br.com.phricardo.listvideo.dto.response.UserForgotPasswordResponseDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserForgotPasswordResponseMapper {

  @Mapping(target = "message", source = "message")
  UserForgotPasswordResponseDTO from(String message);
}
