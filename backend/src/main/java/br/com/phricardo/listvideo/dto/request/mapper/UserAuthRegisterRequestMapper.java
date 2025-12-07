package br.com.phricardo.listvideo.dto.request.mapper;

import br.com.phricardo.listvideo.dto.request.UserAuthRegisterRequestDTO;
import br.com.phricardo.listvideo.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;

@Mapper(componentModel = "spring")
public abstract class UserAuthRegisterRequestMapper {

  @Autowired private PasswordEncoder passwordEncoder;

  @Mapping(target = "id", ignore = true)
  @Mapping(target = "userId", ignore = true)
  @Mapping(target = "isAccountActivated", constant = "false")
  @Mapping(target = "isVerifiedAccount", constant = "false")
  @Mapping(source = "email", target = "email", qualifiedByName = "toLowerCase")
  @Mapping(source = "password", target = "password", qualifiedByName = "encodePassword")
  public abstract User from(UserAuthRegisterRequestDTO userAuthRegisterRequestDTO);

  @Named("encodePassword")
  protected String encodePassword(String password) {
    return passwordEncoder.encode(password);
  }

  @Named("toUpperCase")
  protected String toUpperCase(String text) {
    return text.toUpperCase();
  }

  @Named("toLowerCase")
  protected String toLowerCase(String text) {
    return text.toLowerCase();
  }
}
