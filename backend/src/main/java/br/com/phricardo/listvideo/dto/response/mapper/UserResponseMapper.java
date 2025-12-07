package br.com.phricardo.listvideo.dto.response.mapper;

import br.com.phricardo.listvideo.dto.response.UserResponseDTO;
import br.com.phricardo.listvideo.model.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserResponseMapper {

  UserResponseDTO from(User user);
}
