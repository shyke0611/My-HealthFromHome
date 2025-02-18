package com.example.ai_doctor;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync 
public class AiDoctorApplication {

	public static void main(String[] args) {
		SpringApplication.run(AiDoctorApplication.class, args);
	}

}
