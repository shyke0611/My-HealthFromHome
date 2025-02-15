package com.example.ai_doctor.dto;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApiResponse {
    private LocalDateTime timestamp;
    private int status;
    private Object message;
    private Object data;

    public ApiResponse(int status, Object message, Object data) {
        this.timestamp = LocalDateTime.now();
        this.status = status;
        this.message = message;
        this.data = data;
    }

}
