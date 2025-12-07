package br.com.phricardo.listvideo.dto.response.mapper;

import br.com.phricardo.listvideo.dto.response.UserAvailabilityUsernameResponseDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserAvailabilityUsernameResponseMapper {

  @Mapping(target = "username", source = "username")
  @Mapping(target = "availability", source = "availability")
  UserAvailabilityUsernameResponseDTO from(String username, boolean availability);
}
