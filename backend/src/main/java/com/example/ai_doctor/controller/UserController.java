package com.example.ai_doctor.controller;

import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

// import com.example.ai_doctor.dto.ChangeEmailDto;
import com.example.ai_doctor.dto.ChangeNameDto;
import com.example.ai_doctor.dto.ChangePasswordDto;
import com.example.ai_doctor.model.User;
import com.example.ai_doctor.service.UserService;
import com.example.ai_doctor.util.ApiResponseBuilder;

import jakarta.validation.Valid;
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

    // @PutMapping("/change-email")
    // public ResponseEntity<?> changeEmail(@AuthenticationPrincipal User user, @Valid @RequestBody ChangeEmailDto changeEmailDto) {
    //     String newEmail = changeEmailDto.getNewEmail();

    //     if (!userService.isValidNewEmail(user, newEmail)) {
    //         if (user.getEmail().equalsIgnoreCase(newEmail)) {
    //             return ApiResponseBuilder.buildFieldError(HttpStatus.BAD_REQUEST, "email",
    //                     messageSource.getMessage("Error.user.sameEmail", null, Locale.getDefault()));
    //         }
    //         return ApiResponseBuilder.buildFieldError(HttpStatus.CONFLICT, "email",
    //                 messageSource.getMessage("Conflict.user.email", null, Locale.getDefault()));
    //     }

    //     boolean success = userService.changeEmail(user, changeEmailDto);
    //     if (!success) {
    //         return ApiResponseBuilder.build(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to update email.");
    //     }

    //     return ApiResponseBuilder.build(HttpStatus.OK,
    //             messageSource.getMessage("Success.user.changeEmail", null, Locale.getDefault()));
    // }

    @PutMapping("/change-name")
    public ResponseEntity<?> changeName(@AuthenticationPrincipal User user, @Valid @RequestBody ChangeNameDto changeNameDto) {
        userService.changeName(user, changeNameDto);
        return ApiResponseBuilder.build(HttpStatus.OK,
                messageSource.getMessage("Success.user.changeName", null, Locale.getDefault()));
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@AuthenticationPrincipal User user, @Valid @RequestBody ChangePasswordDto changePasswordDto) {
        boolean success = userService.changePassword(user, changePasswordDto);

        if (!success) {
            return ApiResponseBuilder.buildFieldError(HttpStatus.BAD_REQUEST, "password",
                    messageSource.getMessage("Error.user.incorrectPassword", null, Locale.getDefault()));
        }

        return ApiResponseBuilder.build(HttpStatus.OK,
                messageSource.getMessage("Success.user.changePassword", null, Locale.getDefault()));
    }
}
