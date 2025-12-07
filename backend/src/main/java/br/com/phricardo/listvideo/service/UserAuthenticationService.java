package br.com.phricardo.listvideo.service;

import static java.lang.String.format;
import static java.util.Optional.of;
import static java.util.Optional.ofNullable;

import br.com.phricardo.listvideo.dto.request.UserAuthLoginRequestDTO;
import br.com.phricardo.listvideo.dto.request.UserAuthRegisterRequestDTO;
import br.com.phricardo.listvideo.dto.request.mapper.UserAuthRegisterRequestMapper;
import br.com.phricardo.listvideo.dto.response.TokenResponseDTO;
import br.com.phricardo.listvideo.dto.response.UserAvailabilityUsernameResponseDTO;
import br.com.phricardo.listvideo.dto.response.UserResponseDTO;
import br.com.phricardo.listvideo.dto.response.mapper.TokenResponseMapper;
import br.com.phricardo.listvideo.dto.response.mapper.UserAvailabilityUsernameResponseMapper;
import br.com.phricardo.listvideo.dto.response.mapper.UserResponseMapper;
import br.com.phricardo.listvideo.exception.ApiException;
import br.com.phricardo.listvideo.exception.EmailNotVerifiedException;
import br.com.phricardo.listvideo.exception.LoginException;
import br.com.phricardo.listvideo.exception.UserActivationException;
import br.com.phricardo.listvideo.exception.handler.ErrorKey;
import br.com.phricardo.listvideo.model.User;
import br.com.phricardo.listvideo.repository.UserAuthRepository;
import br.com.phricardo.listvideo.service.email.EmailSender;
import br.com.phricardo.listvideo.service.email.EmailTemplateBuilder;
import java.util.Map;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserAuthenticationService implements UserDetailsService {

  private final UserAuthRepository repository;
  private final UserAuthRegisterRequestMapper registerRequestMapper;
  private final TokenResponseMapper tokenResponseMapper;
  private final UserResponseMapper userResponseMapper;
  private final UserAvailabilityUsernameResponseMapper userAvailabilityUsernameResponseMapper;
  private final TokenService tokenService;
  private final EmailSender emailSender;
  private final EmailTemplateBuilder emailTemplateBuilder;

  @Value("${app.account_activation_url}")
  private String ACCOUNT_ACTIVATION_URL;

  @Value("${app.auto_activate_users:false}")
  private boolean autoActivateUsers;

  @Override
  public UserDetails loadUserByUsername(final String login) throws UsernameNotFoundException {
    return repository.findByEmailOrUsername(login, login);
  }

  public UserResponseDTO registerUser(
      @NonNull final UserAuthRegisterRequestDTO registerRequestDTO) {
    return of(registerRequestDTO)
        .map(registerRequestMapper::from)
        .map(this::applyAutoActivation)
        .map(repository::save)
        .map(this::sendAccountVerificationEmailSafely)
        .map(userResponseMapper::from)
        .orElseThrow(() -> new ApiException(ErrorKey.REGISTRATION_REQUEST_NULL));
  }

  public TokenResponseDTO loginUser(
      @NonNull final UserAuthLoginRequestDTO loginRequestDTO, final AuthenticationManager manager) {
    final var login = loginRequestDTO.getLogin();
    final var password = loginRequestDTO.getPassword();
    final var existsByLogin = repository.existsByEmailOrUsername(login, login);

    return of(existsByLogin)
        .filter(existsUser -> existsUser)
        .map(existsUser -> new UsernamePasswordAuthenticationToken(login, password))
        .map(
            token ->
                ofNullable(manager.authenticate(token))
                    .map(
                        auth -> {
                          final var principal = auth.getPrincipal();
                          return (User) principal;
                        })
                    .map(
                        user -> {
                          if (!user.getIsAccountActivated()) throw new EmailNotVerifiedException();
                          return user;
                        })
                    .map(tokenService::generate)
                    .map(tokenResponseMapper::from)
                    .orElseThrow(LoginException::new))
        .orElseThrow(LoginException::new);
  }

  public UserDetails getCurrentUserDetails() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    return (UserDetails) authentication.getPrincipal();
  }

  public User getCurrentUser() {
    UserDetails userDetails = getCurrentUserDetails();
    return (User) userDetails;
  }

  public UserResponseDTO getCurrentUserDTO() {
    return userResponseMapper.from(getCurrentUser());
  }

  public User getUserByUsername(String username) {
    return repository
        .findByUsername(username)
        .orElseThrow(
            () ->
                new ApiException(
                    ErrorKey.USER_NOT_FOUND_BY_USERNAME,
                    Map.of("username", username),
                    username));
  }

  public UserAvailabilityUsernameResponseDTO isUsernameRegistered(String username) {
    final var availability = repository.findByUsername(username).isEmpty();
    return userAvailabilityUsernameResponseMapper.from(username, availability);
  }

  public User getUserByEmail(String email) {
    return repository
        .findByEmail(email)
        .orElseThrow(
            () ->
                new ApiException(
                    ErrorKey.USER_NOT_FOUND_BY_EMAIL, Map.of("email", email), email));
  }

  public UserResponseDTO getUserResponseByUsername(String username) {
    return of(getUserByUsername(username))
        .map(userResponseMapper::from)
        .orElseThrow(
            () ->
                new ApiException(
                    ErrorKey.USER_NOT_FOUND_BY_USERNAME,
                    Map.of("username", username),
                    username));
  }

  public UserResponseDTO activateAccount(String userId) {
    return repository
        .findByUserIdAndIsAccountActivatedFalse(userId)
        .map(
            user -> {
              user.setIsAccountActivated(true);
              return user;
            })
        .map(repository::save)
        .map(userResponseMapper::from)
        .orElseThrow(
            () ->
                new ApiException(
                    ErrorKey.ACCOUNT_ACTIVATION_NOTFOUND, Map.of("userId", userId), userId));
  }

  public void accountActivationEmailResend(String email) {
    final var user = getUserByEmail(email);
    final var userStatus = user.getIsAccountActivated();
    if (userStatus) throw new UserActivationException();
    sendAccountVerificationEmail(user);
  }

  private User applyAutoActivation(@NonNull User user) {
    if (autoActivateUsers) {
      user.setIsAccountActivated(true);
    }
    return user;
  }

  private User sendAccountVerificationEmailSafely(@NonNull User user) {
    if (autoActivateUsers) {
      return user;
    }
    try {
      sendAccountVerificationEmail(user);
    } catch (Exception ex) {
      log.error("Failed to send account activation email to {}", user.getEmail(), ex);
    }
    return user;
  }

  private void sendAccountVerificationEmail(@NonNull User user) {
    if (autoActivateUsers) {
      return;
    }
    emailSender
        .setRecipient(user.getEmail())
        .setSubject("ListVideo - Verify Your Account")
        .setBody(
            emailTemplateBuilder
                .setTemplate("email-template.html")
                .setName(user.getName())
                .setBody(
                    "Welcome to ListVideo!<br> Before you start enjoying everything we have to offer, remember to activate your account.")
                .setLinkText("Activate my account")
                .setLinkUrl(format("%s%s", ACCOUNT_ACTIVATION_URL, user.getUserId()))
                .build(),
            true)
        .send();
  }
}
