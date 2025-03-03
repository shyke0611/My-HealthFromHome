package com.example.ai_doctor.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChangeNameDto {
    @NotEmpty(message = "{NotEmpty.user.firstName}")
    private String firstName;

    @NotEmpty(message = "{NotEmpty.user.lastName}")
    private String lastName;
}
