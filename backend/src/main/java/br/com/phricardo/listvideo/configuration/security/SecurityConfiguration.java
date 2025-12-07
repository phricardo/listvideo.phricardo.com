package br.com.phricardo.listvideo.configuration.security;

import static java.util.Arrays.asList;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfiguration {

  private final SecurityFilter securityFilter;

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
    return httpSecurity
        .csrf()
        .disable()
        .sessionManagement()
        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        .and()
        .authorizeHttpRequests()
        .requestMatchers("/v1/auth/**")
        .permitAll()
        .requestMatchers("/v1/account/**")
        .permitAll()
        .requestMatchers("/v1/status/**")
        .permitAll()
        .requestMatchers("/v3/api-docs/**", "/swagger-ui.html", "/swagger-ui/**", "/")
        .permitAll()
        .requestMatchers(HttpMethod.GET, "/v1/user/**")
        .permitAll()
        .requestMatchers(HttpMethod.GET, "/v1/user/avatar/{username}")
        .permitAll()
        .requestMatchers(HttpMethod.GET, "/v1/certificate/{username}/{certificateId}")
        .permitAll()
        .requestMatchers("/actuator/**")
        .permitAll()
        .anyRequest()
        .authenticated()
        .and()
        .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
        .cors()
        .configurationSource(
            request -> {
              CorsConfiguration corsCfg = new CorsConfiguration();
              corsCfg.setAllowedOrigins(
                  asList(
                      "http://localhost:3000",
                      "https://localhost:3000",
                      "https://listvideo.phricardo.com",
                      "https://listvideo.app"));
              corsCfg.setAllowedMethods(
                  asList("HEAD", "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
              corsCfg.setAllowCredentials(true);
              corsCfg.setAllowedHeaders(List.of("*"));
              corsCfg.setExposedHeaders(
                  asList(
                      "X-Auth-Token",
                      "Authorization",
                      "Access-Control-Allow-Origin",
                      "Access-Control-Allow-Credentials"));
              return corsCfg;
            })
        .and()
        .build();
  }

  @Bean
  public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration)
      throws Exception {
    return configuration.getAuthenticationManager();
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }
}
