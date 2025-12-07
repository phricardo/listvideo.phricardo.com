package br.com.phricardo.listvideo.dto.update.mapper;

import br.com.phricardo.listvideo.dto.update.UserForgotPasswordRequestDTO;
import br.com.phricardo.listvideo.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;

@Mapper(componentModel = "spring")
public abstract class UserForgotPasswordUpdateMapper {

  @Autowired private PasswordEncoder passwordEncoder;

  @Mapping(target = "password", source = "newPassword", qualifiedByName = "encodePassword")
  public abstract void updatePasswordFromDTO(
      UserForgotPasswordRequestDTO requestDTO, @MappingTarget User user);

  @Named("encodePassword")
  protected String encodePassword(String password) {
    return passwordEncoder.encode(password);
  }
}
