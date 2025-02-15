package com.example.ai_doctor.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserVerifyDto {
    @NotEmpty(message = "{NotEmpty.user.email}")
    private String email;
    @NotEmpty(message = "{NotEmpty.user.verificationCode}")
    private String verificationCode;

}
