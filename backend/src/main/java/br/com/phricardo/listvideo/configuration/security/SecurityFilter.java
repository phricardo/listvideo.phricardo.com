package br.com.phricardo.listvideo.configuration.security;

import br.com.phricardo.listvideo.repository.UserAuthRepository;
import br.com.phricardo.listvideo.service.TokenService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Slf4j
@Component
@RequiredArgsConstructor
public class SecurityFilter extends OncePerRequestFilter {

  private final TokenService tokenService;
  private final UserAuthRepository userAuthRepository;

  @Value("${app.cookie.name:listvideo_token}")
  private String authCookieName;

  private static final List<RequestMatcher> PUBLIC_MATCHERS =
      List.of(
          new AntPathRequestMatcher("/"),
          new AntPathRequestMatcher("/v1/auth/login", "POST"),
          new AntPathRequestMatcher("/v1/auth/register", "POST"),
          new AntPathRequestMatcher("/v1/auth/logout", "POST"),
          new AntPathRequestMatcher("/v1/account/**"),
          new AntPathRequestMatcher("/v1/status/**"),
          new AntPathRequestMatcher("/v1/user/**", "GET"),
          new AntPathRequestMatcher("/v1/certificate/**", "GET"),
          new AntPathRequestMatcher("/v3/api-docs/**"),
          new AntPathRequestMatcher("/swagger-ui.html"),
          new AntPathRequestMatcher("/swagger-ui/**"),
          new AntPathRequestMatcher("/actuator/**"));

  @Override
  protected boolean shouldNotFilter(HttpServletRequest request) {
    return PUBLIC_MATCHERS.stream().anyMatch(matcher -> matcher.matches(request));
  }

  @Override
  protected void doFilterInternal(
      HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws IOException, ServletException {
    final var token = extractToken(request);
    if (token != null) {
      try {
        final var subject = tokenService.validateAndGetSubject(token);
        final var user = userAuthRepository.findByEmailOrUsername(subject, subject);
        final var authentication =
            new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);
      } catch (Exception exception) {
        response.reset();
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType("application/json");

        final var date =
            new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date()).replace(" ", "T");
        final var errorResponse = new ErrorResponse(date, 403, "Invalid or expired token");
        final var json = new ObjectMapper().writeValueAsString(errorResponse);
        response.getWriter().write(json);

        log.error("TOKEN JWT ERROR: Invalid or expired token");
        return;
      }
    }
    filterChain.doFilter(request, response);
  }

  private String extractToken(HttpServletRequest request) {
    return Optional.ofNullable(request.getCookies())
        .flatMap(
            cookies ->
                java.util.Arrays.stream(cookies)
                    .filter(Objects::nonNull)
                    .filter(cookie -> authCookieName.equals(cookie.getName()))
                    .map(Cookie::getValue)
                    .findFirst())
        .orElseGet(() -> getHeaderToken(request));
  }

  private String getHeaderToken(HttpServletRequest request) {
    final var authorizationHeader = request.getHeader("Authorization");
    if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
      return authorizationHeader.substring("Bearer ".length());
    }
    return null;
  }

  private record ErrorResponse(String date, int httpStatusCode, String message) {}
}
