package com.example.ai_doctor.model;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import lombok.Getter;
import lombok.Setter;

@Document(collection = "users")
@Getter
@Setter
public class User implements UserDetails {

    public enum Role {
        USER,
        ADMIN
    }

    @Id
    private String id;

    @Indexed(unique = true)
    private String email;

    private String password;

    private String firstName;

    private String lastName;

    private String verificationCode;

    private LocalDateTime verificationCodeExpiresAt;

    private String resetPasswordToken;
    
    private LocalDateTime resetPasswordTokenExpiresAt;

    private boolean enabled;

    private Role role;

    public User(String email, String password, String firstName, String lastName, Role role) {
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
    }

    public User() {
    }

    @Override
    public String getUsername() {
        return id;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }
}
