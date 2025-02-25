package com.example.ai_doctor.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.ai_doctor.dto.UserLoginDto;
import com.example.ai_doctor.dto.UserRegistrationDto;
import com.example.ai_doctor.model.User;
import com.example.ai_doctor.model.User.Role;
import com.example.ai_doctor.repository.UserRepository;

import jakarta.mail.MessagingException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Random;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    @Value("${frontend.dev.url}")
    private String frontendDevUrl;

    public AuthService(
            UserRepository userRepository,
            AuthenticationManager authenticationManager,
            PasswordEncoder passwordEncoder,
            EmailService emailService) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    public void signup(UserRegistrationDto input) {
        User user = new User(input.getEmail(), passwordEncoder.encode(input.getPassword()), input.getFirstName(),
                input.getLastName(), Role.USER);
        user.setVerificationCode(generateVerificationCode());
        user.setVerificationCodeExpiresAt(LocalDateTime.now().plusMinutes(15));
        user.setEnabled(false);
        sendVerificationEmail(user);
        userRepository.save(user);
    }

    public boolean authenticate(UserLoginDto input) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(input.getEmail(), input.getPassword()));
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public void verifyUser(User user) {
        user.setEnabled(true);
        user.setVerificationCode(null);
        user.setVerificationCodeExpiresAt(null);
        userRepository.save(user);
    }

    public void resendVerificationCode(User user) {
        user.setVerificationCode(generateVerificationCode());
        user.setVerificationCodeExpiresAt(LocalDateTime.now().plusMinutes(15));
        sendVerificationEmail(user);
        userRepository.save(user);
    }

    private String generateVerificationCode() {
        Random random = new Random();
        int code = random.nextInt(900000) + 100000;
        return String.valueOf(code);
    }

    public void requestResetPassword(User user) {
        String resetToken = UUID.randomUUID().toString();
        user.setResetPasswordToken(resetToken);
        String rawToken = UUID.randomUUID().toString();
        String hashedToken = passwordEncoder.encode(rawToken);
        user.setResetPasswordToken(hashedToken);
        user.setResetPasswordTokenExpiresAt(LocalDateTime.now().plusMinutes(15));
        userRepository.save(user);
        sendPasswordResetEmail(user);
    }

    public boolean verifyResetPasswordToken(String resetToken) {
        User user = userRepository.findByResetPasswordToken(resetToken).orElse(null);
        return user != null && user.getResetPasswordTokenExpiresAt().isAfter(LocalDateTime.now());
    }

    public boolean resetPassword(String resetToken, String newPassword) {
        if (!verifyResetPasswordToken(resetToken)) {
            return false;
        }

        User user = userRepository.findByResetPasswordToken(resetToken).orElse(null);
        if (user == null) return false;

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetPasswordToken(null);
        user.setResetPasswordTokenExpiresAt(null);
        userRepository.save(user);

        return true;
    }

    @Async 
    private void sendVerificationEmail(User user) {
        String subject = "My HealhFromHome - Account Verification";
        String htmlTemplate = loadHtmlTemplate("email-templates/verification-email.html");
        String htmlMessage = htmlTemplate.replace("${verificationCode}", user.getVerificationCode())
                .replace("${firstName}", user.getFirstName());

        try {
            emailService.sendVerificationEmail(user.getEmail(), subject, htmlMessage);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

    @Async 
    private void sendPasswordResetEmail(User user) {
        String subject = "Reset Your Password";
        String resetUrl = frontendDevUrl + "/reset-password?token=" + user.getResetPasswordToken();
        String htmlTemplate = loadHtmlTemplate("email-templates/reset-password-email.html");
        String htmlMessage = htmlTemplate.replace("${firstName}", user.getFirstName())
                .replace("${resetUrl}", resetUrl);

        try {
            emailService.sendVerificationEmail(user.getEmail(), subject, htmlMessage);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

    private String loadHtmlTemplate(String path) {
        try (InputStream inputStream = getClass().getClassLoader().getResourceAsStream(path);
                BufferedReader reader = new BufferedReader(
                        new InputStreamReader(inputStream, StandardCharsets.UTF_8))) {

            return reader.lines().collect(Collectors.joining("\n"));

        } catch (Exception e) {
            e.printStackTrace();
            return "Sorry. There was an error";
        }
    }

}
