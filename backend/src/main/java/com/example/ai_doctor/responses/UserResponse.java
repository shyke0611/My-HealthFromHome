package com.example.ai_doctor.responses;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserResponse {
    private String firstName;
    private String lastName;
    private String email;
    private String role;

    public UserResponse(String firstName, String lastName, String email, String role) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.role = role;
    }
}
