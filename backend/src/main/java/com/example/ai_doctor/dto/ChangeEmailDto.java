package com.example.ai_doctor.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChangeEmailDto {
    @NotEmpty(message = "{NotEmpty.user.email}")
    @Email(message = "{Email.user.email}")
    private String newEmail;
}
