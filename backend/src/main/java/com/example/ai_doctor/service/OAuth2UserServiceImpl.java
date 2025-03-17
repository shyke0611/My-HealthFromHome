package com.example.ai_doctor.service;

import com.example.ai_doctor.model.User;
import com.example.ai_doctor.repository.UserRepository;
import com.example.ai_doctor.util.TokenUtils;
import io.jsonwebtoken.Claims;
import org.springframework.stereotype.Service;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import java.util.Optional;
import java.util.UUID;

@Service
public class OAuth2UserServiceImpl {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    @Value("${security.oauth2.client.client-id}")
    private String clientId;

    public OAuth2UserServiceImpl(UserRepository userRepository, JwtService jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    public User processOAuthUser(String idToken) {
        Claims claims = TokenUtils.extractClaimsFromIdToken(idToken, clientId);        
        String email = claims.get("email", String.class);
        String firstName = claims.get("given_name", String.class);
        String lastName = claims.get("family_name", String.class);

        Optional<User> existingUser = userRepository.findByEmail(email);
        User user;

        if (existingUser.isPresent()) {
            user = existingUser.get();

            if (user.isOauthUser() && (user.getFirstName() == null || user.getLastName() == null)) {
                user.setFirstName(firstName);
                user.setLastName(lastName);
            }

            if (!user.isEnabled()) {
                user.setEnabled(true);
                user.setVerificationCode(null);
                user.setVerificationCodeExpiresAt(null);
            }

            user.setEnabled(true);
            userRepository.save(user);
        } else {
            user = new User();
            user.setId(UUID.randomUUID().toString());
            user.setEmail(email);
            user.setFirstName(firstName);
            user.setLastName(lastName);
            user.setEnabled(true);
            user.setRole(User.Role.USER);
            user.setOauthUser(true);
            userRepository.save(user);
        }

        return user;
    }

    public void setOAuthCookie(User user, HttpServletResponse response) {
        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        response.addCookie(jwtService.generateAccessCookie(accessToken));
        response.addCookie(jwtService.generateRefreshCookie(refreshToken));
    }
}
