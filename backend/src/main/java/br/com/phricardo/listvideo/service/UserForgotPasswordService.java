package br.com.phricardo.listvideo.service;

import br.com.phricardo.listvideo.dto.response.UserForgotPasswordResponseDTO;
import br.com.phricardo.listvideo.dto.response.mapper.UserForgotPasswordResponseMapper;
import br.com.phricardo.listvideo.dto.update.UserForgotPasswordRequestDTO;
import br.com.phricardo.listvideo.dto.update.mapper.UserForgotPasswordUpdateMapper;
import br.com.phricardo.listvideo.exception.ApiException;
import br.com.phricardo.listvideo.exception.handler.ErrorKey;
import br.com.phricardo.listvideo.model.EmailNotification;
import br.com.phricardo.listvideo.model.User;
import br.com.phricardo.listvideo.model.UserPasswordResetToken;
import br.com.phricardo.listvideo.repository.UserAuthRepository;
import br.com.phricardo.listvideo.repository.UserPasswordResetTokenRepository;
import br.com.phricardo.listvideo.service.email.EmailContentResolver;
import br.com.phricardo.listvideo.service.email.EmailLanguage;
import br.com.phricardo.listvideo.service.email.EmailTemplateBuilder;
import br.com.phricardo.listvideo.service.email.SendNotification;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserForgotPasswordService {

  private static final int EXPIRATION = 60 * 24;

  private final EmailTemplateBuilder emailTemplateBuilder;
  private final SendNotification sendNotification;
  private final EmailContentResolver emailContentResolver;
  private final UserPasswordResetTokenRepository userPasswordResetTokenRepository;
  private final UserForgotPasswordUpdateMapper userForgotPasswordUpdateMapper;
  private final UserForgotPasswordResponseMapper userForgotPasswordResponseMapper;
  private final UserAuthRepository userAuthRepository;

  @Value("${app.password_recovery_url}")
  private String PASSWORD_RECOVERY_URL;

  public void sendPasswordResetLink(String email, EmailLanguage emailLanguage) {
    final var resolvedLanguage = resolveLanguage(emailLanguage);
    final var user = findUserByEmail(email);
    final var token = generateToken(user);
    final var locale = resolvedLanguage.getLocale();
    final var emailCopy = emailContentResolver.getPasswordResetContent(locale);
    final var resetLink = PASSWORD_RECOVERY_URL + token;
    final var emailBody =
        emailTemplateBuilder.buildActionEmail(
            user.getName(), emailCopy.content(), emailCopy.actionLabel(), resetLink, locale);
    sendPasswordResetEmail(user.getEmail(), emailCopy.subject(), emailBody);
  }

  private String generateToken(User user) {
    final var token = UUID.randomUUID().toString().replace("-", "");
    final var expiryDate = calculateExpiryDate();
    saveOrUpdatePasswordResetToken(token, expiryDate, user);
    return token;
  }

  private void saveOrUpdatePasswordResetToken(String token, LocalDateTime expiryDate, User user) {
    UserPasswordResetToken passwordResetToken =
        userPasswordResetTokenRepository
            .findByUser(user)
            .orElse(UserPasswordResetToken.builder().build());

    passwordResetToken.setToken(token);
    passwordResetToken.setExpiryDate(expiryDate);
    passwordResetToken.setPasswordChanged(false);
    passwordResetToken.setUser(user);

    userPasswordResetTokenRepository.save(passwordResetToken);
  }

  public UserForgotPasswordResponseDTO resetUserPassword(
      UserForgotPasswordRequestDTO userForgotPasswordRequestDTO) {
    final var token = userForgotPasswordRequestDTO.getToken();
    final var isTokenValid = isTokenValid(token);
    if (isTokenValid) {
      final var userPasswordResetToken = findUserPasswordResetTokenByToken(token);
      final var user = userPasswordResetToken.getUser();
      userForgotPasswordUpdateMapper.updatePasswordFromDTO(userForgotPasswordRequestDTO, user);
      userAuthRepository.save(user);
      userPasswordResetToken.setPasswordChanged(true);
      userPasswordResetTokenRepository.save(userPasswordResetToken);
      return userForgotPasswordResponseMapper.from("password updated successfully");
    }
    throw new ApiException(ErrorKey.PASSWORD_RESET_TOKEN_INVALID);
  }

  public boolean isTokenValid(String token) {
    final var userPasswordResetToken = findUserPasswordResetTokenByToken(token);
    final var now = LocalDateTime.now();
    final var expiryDate = userPasswordResetToken.getExpiryDate();
    final var passwordChanged = userPasswordResetToken.getPasswordChanged();
    return !passwordChanged && now.isBefore(expiryDate);
  }

  private UserPasswordResetToken findUserPasswordResetTokenByToken(String token) {
    return userPasswordResetTokenRepository
        .findByToken(token)
        .orElseThrow(() -> new ApiException(ErrorKey.PASSWORD_RESET_TOKEN_MISSING));
  }

  private User findUserByEmail(String email) {
    return userAuthRepository
        .findByEmail(email)
        .orElseThrow(
            () ->
                new ApiException(ErrorKey.USER_NOT_FOUND_BY_EMAIL, Map.of("email", email), email));
  }

  private LocalDateTime calculateExpiryDate() {
    return LocalDateTime.now().plusMinutes(EXPIRATION);
  }

  private void sendPasswordResetEmail(String recipient, String subject, String emailBody) {
    sendNotification.send(
        EmailNotification.builder()
            .to(recipient)
            .subject(subject)
            .htmlContent(emailBody)
            .build());
  }

  private EmailLanguage resolveLanguage(EmailLanguage emailLanguage) {
    return emailLanguage != null ? emailLanguage : EmailLanguage.EN;
  }
}
