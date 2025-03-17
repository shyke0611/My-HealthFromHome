package com.example.ai_doctor.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import jakarta.servlet.http.HttpServletResponse;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
        private final AuthenticationProvider authenticationProvider;
        private final JwtAuthFilter jwtAuthenticationFilter;

        @Value("${frontend.dev.url}")
        private String frontendDevUrl;

        @Value("${backend.dev.url}")
        private String backendDevUrl;

        @Value("${GOOGLE_CLIENT_ID}")
        private String clientId;

        public SecurityConfig(
                        JwtAuthFilter jwtAuthenticationFilter,
                        AuthenticationProvider authenticationProvider) {
                this.authenticationProvider = authenticationProvider;
                this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        }

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                http
                                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                                .csrf(csrf -> csrf.disable())
                                .authorizeHttpRequests(authorize -> authorize
                                                .requestMatchers("/auth/**").permitAll()
                                                .requestMatchers("/oauth2/**").permitAll()
                                                .requestMatchers("/admin/**").hasAuthority("ROLE_ADMIN")
                                                .requestMatchers("/user/**").hasAuthority("ROLE_USER")
                                                .anyRequest().authenticated())

                                .exceptionHandling(exception -> exception
                                                .authenticationEntryPoint((request, response, authException) -> {
                                                        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                                                        response.getWriter().write("Unauthorized: Access denied");
                                                }))
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .authenticationProvider(authenticationProvider)
                                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                                .headers(headers -> headers
                                                .frameOptions(frameOptions -> frameOptions.sameOrigin())
                                                .contentSecurityPolicy(
                                                                csp -> csp.policyDirectives("script-src 'self'")));
                            

                return http.build();
        }

        @Bean
        public CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration configuration = new CorsConfiguration();
                configuration.setAllowedOrigins(List.of(frontendDevUrl, backendDevUrl));
                configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));
                configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
                configuration.setAllowCredentials(true);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration);
                return source;
        }
}