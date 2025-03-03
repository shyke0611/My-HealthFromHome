package com.example.ai_doctor.controller;

import java.time.LocalDateTime;
import java.util.Locale;
import java.util.concurrent.CompletableFuture;

import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.example.ai_doctor.dto.ResetPasswordDto;
import com.example.ai_doctor.dto.UserLoginDto;
import com.example.ai_doctor.dto.UserRegistrationDto;
import com.example.ai_doctor.dto.UserVerifyDto;
import com.example.ai_doctor.model.User;
import com.example.ai_doctor.repository.UserRepository;
import com.example.ai_doctor.responses.UserResponse;
import com.example.ai_doctor.service.AuthService;
import com.example.ai_doctor.service.JwtService;
import com.example.ai_doctor.util.ApiResponseBuilder;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

@RequestMapping("/auth")
@RestController
public class AuthController {
    private final JwtService jwtService;
    private final AuthService authService;
    private final MessageSource messageSource;
    private final UserRepository userRepository;

    public AuthController(JwtService jwtService, AuthService authService, MessageSource messageSource,
            UserRepository userRepository) {
        this.jwtService = jwtService;
        this.authService = authService;
        this.messageSource = messageSource;
        this.userRepository = userRepository;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> register(@Valid @RequestBody UserRegistrationDto userRegDto) {
        if (userRepository.existsByEmail(userRegDto.getEmail())) {
            return ApiResponseBuilder.buildFieldError(HttpStatus.CONFLICT, "email",
                    messageSource.getMessage("Unique.user.email", null, Locale.getDefault()));
        }
        CompletableFuture.runAsync(() -> authService.signup(userRegDto));
        return ApiResponseBuilder.build(HttpStatus.CREATED,
                messageSource.getMessage("Success.user.registered", null, Locale.getDefault()));

    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticate(@Valid @RequestBody UserLoginDto userLoginDto, HttpServletResponse response) {
        User user = userRepository.findByEmail(userLoginDto.getEmail()).orElse(null);

        if (user == null) {
            return ApiResponseBuilder.buildFieldError(HttpStatus.NOT_FOUND, "email",
                    messageSource.getMessage("NotFound.user.email", null, Locale.getDefault()));
        }

        if (!user.isEnabled()) {
            return ApiResponseBuilder.buildFieldError(HttpStatus.BAD_REQUEST, "verify",
                    messageSource.getMessage("Unverified.user.account", null, Locale.getDefault()));
        }

        boolean authenticated = authService.authenticate(userLoginDto);
        if (!authenticated) {
            return ApiResponseBuilder.buildFieldError(HttpStatus.UNAUTHORIZED, "credentials",
                    messageSource.getMessage("Invalid.user.credentials", null, Locale.getDefault()));
        }

        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        response.addCookie(jwtService.generateAccessCookie(accessToken));
        response.addCookie(jwtService.generateRefreshCookie(refreshToken));

        UserResponse userResponse = new UserResponse(
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getRole().name());

        return ApiResponseBuilder.build(
                HttpStatus.OK,
                messageSource.getMessage("Success.user.login", null, Locale.getDefault()),
                userResponse);
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyUser(@Valid @RequestBody UserVerifyDto verifyUserDto) {
        User user = userRepository.findByEmail(verifyUserDto.getEmail()).orElse(null);

        if (user == null) {
            return ApiResponseBuilder.buildFieldError(HttpStatus.NOT_FOUND, "email",
                    messageSource.getMessage("NotFound.user.email", null, Locale.getDefault()));
        }

        if (user.getVerificationCodeExpiresAt().isBefore(LocalDateTime.now())) {
            return ApiResponseBuilder.buildFieldError(HttpStatus.BAD_REQUEST, "verificationExpired",
                    messageSource.getMessage("Expired.user.verification", null, Locale.getDefault()));
        }

        if (!user.getVerificationCode().equals(verifyUserDto.getVerificationCode())) {
            return ApiResponseBuilder.buildFieldError(HttpStatus.BAD_REQUEST, "verificationInvalid",
                    messageSource.getMessage("Invalid.user.verificationCode", null, Locale.getDefault()));
        }

        authService.verifyUser(user);
        return ApiResponseBuilder.build(HttpStatus.OK,
                messageSource.getMessage("Success.user.verify", null, Locale.getDefault()));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(
            @CookieValue(value = "refreshToken", defaultValue = "") String refreshToken,
            HttpServletResponse response) {

        if (refreshToken.isEmpty()) {
            return ApiResponseBuilder.build(HttpStatus.UNAUTHORIZED, "No refresh token found");
        }
        String userId = jwtService.extractUserId(refreshToken);
        if (userId == null || jwtService.isTokenExpired(refreshToken)) {
            return ApiResponseBuilder.build(HttpStatus.UNAUTHORIZED, "Invalid or expired refresh token");
        }

        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return ApiResponseBuilder.build(HttpStatus.UNAUTHORIZED, "User not found");
        }

        String newAccessToken = jwtService.generateAccessToken(user);
        response.addCookie(jwtService.generateAccessCookie(newAccessToken));

        return ApiResponseBuilder.build(
                HttpStatus.OK,
                "Access token refreshed successfully");
    }

    @PostMapping("/resendVerification")
    public ResponseEntity<?> resendVerificationCode(@Valid @RequestParam String email) {
        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            return ApiResponseBuilder.buildFieldError(HttpStatus.NOT_FOUND, "email",
                    messageSource.getMessage("NotFound.user.email", null, Locale.getDefault()));
        }

        if (user.isEnabled()) {
            return ApiResponseBuilder.buildFieldError(HttpStatus.BAD_REQUEST, "account",
                    messageSource.getMessage("AlreadyVerified.user.account", null, Locale.getDefault()));
        }

        authService.resendVerificationCode(user);
        return ApiResponseBuilder.build(HttpStatus.OK,
                messageSource.getMessage("Success.user.resend", null, Locale.getDefault()));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        response.addCookie(jwtService.generateDeleteAccessCookie());
        response.addCookie(jwtService.generateDeleteRefreshCookie());

        return ApiResponseBuilder.build(
                HttpStatus.OK,
                messageSource.getMessage("Success.user.logout", null, Locale.getDefault()));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user != null) {
            CompletableFuture.runAsync(() -> authService.requestResetPassword(user));
        }
        return ApiResponseBuilder.build(HttpStatus.OK,
                messageSource.getMessage("Success.user.resendPass", null, Locale.getDefault()));
    }

    @GetMapping("/verify-reset-token")
    public ResponseEntity<?> verifyResetToken(@RequestParam String resetToken) {
        if (!authService.verifyResetPasswordToken(resetToken)) {
            return ApiResponseBuilder.build(HttpStatus.BAD_REQUEST,
                    messageSource.getMessage("Invalid.user.passToken", null, Locale.getDefault()));
        }
        return ApiResponseBuilder.build(HttpStatus.OK,
                messageSource.getMessage("Success.user.passToken", null, Locale.getDefault()));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordDto resetPasswordDto) {
        if (!authService.resetPassword(resetPasswordDto.getToken(), resetPasswordDto.getNewPassword())) {
            return ApiResponseBuilder.build(HttpStatus.BAD_REQUEST,
                    messageSource.getMessage("Invalid.user.passToken", null, Locale.getDefault()));
        }
        return ApiResponseBuilder.build(HttpStatus.OK,
                messageSource.getMessage("Success.user.passReset", null, Locale.getDefault()));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }

        UserResponse userResponse = new UserResponse(
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getRole().name());

        return ApiResponseBuilder.build(
                HttpStatus.OK,
                messageSource.getMessage("Success.user.currentUser", null, Locale.getDefault()),
                userResponse);
    }

}