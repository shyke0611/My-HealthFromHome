package com.example.ai_doctor.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRegistrationDto {

    @NotEmpty(message = "{NotEmpty.user.email}")
    @Email(message = "{Email.user.email}")
    private String email;

    @NotEmpty(message = "{NotEmpty.user.password}")
    @Size(min = 6, message = "{Size.user.password}")
    private String password;

    @NotEmpty(message = "{NotEmpty.user.firstName}")
    private String firstName;
    
    @NotEmpty(message = "{NotEmpty.user.lastName}")
    private String lastName;

}
