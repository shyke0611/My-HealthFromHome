package com.example.ai_doctor.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/admin")
@RestController
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    
}
