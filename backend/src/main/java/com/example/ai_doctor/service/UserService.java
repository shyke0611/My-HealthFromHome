package com.example.ai_doctor.service;

import com.example.ai_doctor.dto.ChangeEmailDto;
import com.example.ai_doctor.dto.ChangeNameDto;
import com.example.ai_doctor.dto.ChangePasswordDto;
import com.example.ai_doctor.model.User;
import com.example.ai_doctor.repository.UserRepository;

import java.util.ArrayList;
import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

     public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public boolean isValidNewEmail(User user, String newEmail) {
        if (user.getEmail().equalsIgnoreCase(newEmail)) {
            return false;
        }

        return !userRepository.existsByEmail(newEmail);
    }
    
    public boolean changeEmail(User user, ChangeEmailDto changeEmailDto) {
        String newEmail = changeEmailDto.getNewEmail();
    
        if (!isValidNewEmail(user, newEmail)) {
            return false;
        }
    
        user.setEmail(newEmail);
        userRepository.save(user);
        return true;
    }
    

     public void changeName(User user, ChangeNameDto changeNameDto) {
        user.setFirstName(changeNameDto.getFirstName());
        user.setLastName(changeNameDto.getLastName());
        userRepository.save(user);
    }

    public boolean changePassword(User user, ChangePasswordDto changePasswordDto) {
        if (!passwordEncoder.matches(changePasswordDto.getOldPassword(), user.getPassword())) {
            return false;
        }
        user.setPassword(passwordEncoder.encode(changePasswordDto.getNewPassword()));
        userRepository.save(user);
        return true;
    }


}
