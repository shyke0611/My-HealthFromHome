package com.example.ai_doctor.exception;

import com.example.ai_doctor.dto.ApiResponse;
import com.example.ai_doctor.util.ApiResponseBuilder;

import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    private final MessageSource messageSource;

    public GlobalExceptionHandler(MessageSource messageSource) {
        this.messageSource = messageSource;
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse> handleValidationExceptions(MethodArgumentNotValidException ex, Locale locale) {
        Map<String, String> errors = new HashMap<>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            String localizedMessage = messageSource.getMessage(error, locale);
            errors.put(error.getField(), localizedMessage);
        }

        return ApiResponseBuilder.build(HttpStatus.BAD_REQUEST, errors, null);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse> handleAllExceptions(Exception ex) {
        Map<String, String> errorMessage = Map.of("error", "An unexpected error occurred: " + ex.getMessage());
        return ApiResponseBuilder.build(HttpStatus.INTERNAL_SERVER_ERROR, errorMessage, null);
    }
}
