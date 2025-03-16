package com.example.ai_doctor.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.config.oauth2.client.CommonOAuth2Provider;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.registration.InMemoryClientRegistrationRepository;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.example.ai_doctor.service.OAuth2UserServiceImpl;
import jakarta.servlet.http.HttpServletResponse;
import com.example.ai_doctor.model.User;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
        private final AuthenticationProvider authenticationProvider;
        private final JwtAuthFilter jwtAuthenticationFilter;
        private final OAuth2UserServiceImpl oAuth2UserService;

        @Value("${frontend.dev.url}")
        private String frontendDevUrl;

        @Value("${backend.dev.url}")
        private String backendDevUrl;

        @Value("${GOOGLE_CLIENT_ID}")
        private String clientId;

        @Value("${GOOGLE_CLIENT_SECRET}")
        private String clientSecret;

        @Value("${GOOGLE_REDIRECT_URI}")
        private String redirectUri;

        public SecurityConfig(
                        JwtAuthFilter jwtAuthenticationFilter,
                        AuthenticationProvider authenticationProvider,
                        OAuth2UserServiceImpl oAuth2UserService) {
                this.authenticationProvider = authenticationProvider;
                this.jwtAuthenticationFilter = jwtAuthenticationFilter;
                this.oAuth2UserService = oAuth2UserService;
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
                                                                csp -> csp.policyDirectives("script-src 'self'")))

                                .oauth2Login(oauth2 -> oauth2
                                                .userInfoEndpoint(
                                                                userInfo -> userInfo.oidcUserService(oAuth2UserService))
                                                .successHandler((request, response, authentication) -> {
                                                        OidcUser oidcUser = (OidcUser) authentication.getPrincipal();
                                                        User user = oAuth2UserService.processOAuthUser(oidcUser);
                                                        SecurityContextHolder.getContext().setAuthentication(
                                                                        new UsernamePasswordAuthenticationToken(
                                                                                        user, null,
                                                                                        user.getAuthorities()));
                                                        oAuth2UserService.setOAuthCookie(user, response);
                                                        response.sendRedirect("http://localhost:3000/dashboard");
                                                }));

                return http.build();
        }

        @Bean
        public OidcUserService oidcUserService() {
                return new OidcUserService();
        }

        @Bean
        public ClientRegistrationRepository clientRegistrationRepository() {
                return new InMemoryClientRegistrationRepository(this.googleClientRegistration());
        }

        private ClientRegistration googleClientRegistration() {
                return CommonOAuth2Provider.GOOGLE.getBuilder("google")
                                .clientId(clientId)
                                .clientSecret(clientSecret)
                                .redirectUri(redirectUri)
                                .scope("email", "profile")
                                .build();
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