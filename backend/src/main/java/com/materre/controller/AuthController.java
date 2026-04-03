package com.materre.controller;

import com.materre.model.User;
import com.materre.repository.UserRepository;
import com.materre.security.JwtService;
import com.materre.service.OtpService;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    private final UserRepository userRepository;
    private final OtpService otpService;
    private final JwtService jwtService;

    @PostMapping("/otp/send")
    public ResponseEntity<String> sendOtp(@RequestParam String phoneNumber) {
        otpService.generateOtp(phoneNumber);
        return ResponseEntity.ok("OTP envoyé avec succès via WhatsApp/SMS.");
    }

    @PostMapping("/otp/verify")
    public ResponseEntity<AuthResponse> verifyOtp(@RequestBody OtpVerifyRequest request) {
        if (otpService.validateOtp(request.getPhoneNumber(), request.getOtp())) {
            var user = userRepository.findByPhoneNumber(request.getPhoneNumber())
                    .orElseGet(() -> {
                        // Create a new user if not exists (Register-on-Login)
                        User newUser = User.builder()
                                .fullName("Nouveau Utilisateur")
                                .phoneNumber(request.getPhoneNumber())
                                .role(User.Role.BUYER)
                                .build();
                        return userRepository.save(newUser);
                    });
            var jwtToken = jwtService.generateToken(user);
            return ResponseEntity.ok(AuthResponse.builder().token(jwtToken).build());
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    @Data
    public static class OtpVerifyRequest {
        private String phoneNumber;
        private String otp;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AuthResponse {
        private String token;
    }
}
