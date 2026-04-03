package com.materre.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
@Slf4j
@RequiredArgsConstructor
public class OtpService {

    // In a production app, use Redis to store OTPs with expiration
    private final Map<String, String> otpStorage = new HashMap<>();

    public String generateOtp(String phoneNumber) {
        String otp = String.format("%06d", new Random().nextInt(999999));
        otpStorage.put(phoneNumber, otp);
        
        // Mock sending via WhatsApp/SMS
        sendViaWhatsApp(phoneNumber, otp);
        sendViaSMS(phoneNumber, otp);
        
        return otp;
    }

    public boolean validateOtp(String phoneNumber, String otp) {
        return otp.equals(otpStorage.get(phoneNumber));
    }

    private void sendViaWhatsApp(String phoneNumber, String otp) {
        log.info("[WHATSAPP] Sending OTP {} to {}", otp, phoneNumber);
        // Integrate with Twilio or other WhatsApp API here
    }

    private void sendViaSMS(String phoneNumber, String otp) {
        log.info("[SMS] Sending OTP {} to {}", otp, phoneNumber);
        // Integrate with SMS gateway here
    }
}
