package com.example.ai_doctor.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChangePasswordDto {
    @NotEmpty(message = "{NotEmpty.user.password}")
    private String oldPassword;

    @NotEmpty(message = "{NotEmpty.user.password}")
    @Size(min = 6, message = "{Size.user.password}")
    private String newPassword;
}
