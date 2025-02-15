package com.example.ai_doctor.util;

import com.example.ai_doctor.dto.ApiResponse;
import com.example.ai_doctor.responses.UserResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.Map;

public class ApiResponseBuilder {

    public static ResponseEntity<ApiResponse> build(HttpStatus status, Object message, Object data) {
        if (data instanceof UserResponse) {
            Map<String, Object> wrappedData = new HashMap<>();
            wrappedData.put("user", data);
            data = wrappedData;
        }

        ApiResponse response = new ApiResponse(
                status.value(),
                message,
                data
        );
        return new ResponseEntity<>(response, status);
    }

    public static ResponseEntity<ApiResponse> build(HttpStatus status, Object message) {
        return build(status, message, null);
    }

    public static ResponseEntity<ApiResponse> buildFieldError(HttpStatus status, String field, String message) {
        Map<String, String> fieldError = new HashMap<>();
        fieldError.put(field, message);
        return build(status, fieldError, null);
    }

    public static ResponseEntity<ApiResponse> buildFieldErrors(HttpStatus status, String[][] errors) {
        Map<String, String> fieldErrors = new HashMap<>();
        for (String[] error : errors) {
            fieldErrors.put(error[0], error[1]);
        }
        return build(status, fieldErrors, null);
    }
}
