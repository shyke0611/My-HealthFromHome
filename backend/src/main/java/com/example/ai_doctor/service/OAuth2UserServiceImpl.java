package com.example.ai_doctor.service;

import com.example.ai_doctor.model.User;
import com.example.ai_doctor.repository.UserRepository;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.stereotype.Service;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import jakarta.servlet.http.HttpServletResponse;
import java.util.Collections;
import java.util.Optional;
import java.util.UUID;

@Service
public class OAuth2UserServiceImpl extends OidcUserService {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    public OAuth2UserServiceImpl(UserRepository userRepository, JwtService jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    @Override
    public OidcUser loadUser(OidcUserRequest userRequest) {
        OidcUser oidcUser = super.loadUser(userRequest);
        return new DefaultOidcUser(
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")),
                oidcUser.getIdToken(), 
                "email");
    }

    public User processOAuthUser(OidcUser oidcUser) {
        String email = oidcUser.getEmail();
        Optional<User> existingUser = userRepository.findByEmail(email);

        User user;
        if (existingUser.isPresent()) {
            user = existingUser.get();
        } else {
            user = new User();
            user.setId(UUID.randomUUID().toString());
            user.setEmail(email);
            user.setFirstName(oidcUser.getGivenName());
            user.setLastName(oidcUser.getFamilyName());
            user.setEnabled(true);
            user.setRole(User.Role.USER);
            userRepository.save(user);
        }

        return user; // ✅ Now it returns a User instead of an OidcUser
    }

    public void setOAuthCookie(User user, HttpServletResponse response) {
        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        response.addCookie(jwtService.generateAccessCookie(accessToken));
        response.addCookie(jwtService.generateRefreshCookie(refreshToken));
    }
}
