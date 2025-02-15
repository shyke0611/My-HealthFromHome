package com.example.ai_doctor.controller;


import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.ai_doctor.model.User;
import com.example.ai_doctor.responses.UserResponse;
import com.example.ai_doctor.service.UserService;
import com.example.ai_doctor.util.ApiResponseBuilder;

import java.util.List;
import java.util.Locale;

@RequestMapping("/user")
@RestController
@PreAuthorize("hasRole('USER')")
public class UserController {

    private final UserService userService;
     private final MessageSource messageSource;

    public UserController(UserService userService, MessageSource messageSource) {
        this.userService = userService;
        this.messageSource = messageSource;
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal User user) {

        UserResponse userResponse = new UserResponse(user.getFirstName(), user.getLastName(), user.getEmail());
        return ApiResponseBuilder.build(
                HttpStatus.OK,
                messageSource.getMessage("Success.user.currentUser", null, Locale.getDefault()),
                userResponse);
    }
    

    @GetMapping("/")
    public ResponseEntity<List<User>> allUsers() {
        List <User> users = userService.allUsers();
        return ResponseEntity.ok(users);
    }
}
