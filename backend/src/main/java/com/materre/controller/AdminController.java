package com.materre.controller;

import com.materre.model.User;
import com.materre.model.VerificationRequest;
import com.materre.repository.UserRepository;
import com.materre.repository.VerificationRequestRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final VerificationRequestRepository requestRepository;
    private final UserRepository userRepository;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("pendingAudits", requestRepository.findByRequestStatus(VerificationRequest.RequestStatus.PENDING).size());
        stats.put("totalNotaries", userRepository.findByRole(User.Role.NOTARY).size());
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/pending-requests")
    public ResponseEntity<List<VerificationRequest>> getPendingRequests() {
        return ResponseEntity.ok(requestRepository.findByRequestStatus(VerificationRequest.RequestStatus.PENDING));
    }

    @GetMapping("/notaries")
    public ResponseEntity<List<User>> getNotaries() {
        return ResponseEntity.ok(userRepository.findByRole(User.Role.NOTARY));
    }

    @PostMapping("/assign-notary")
    public ResponseEntity<VerificationRequest> assignNotary(@RequestBody AssignNotaryRequest body) {
        VerificationRequest request = requestRepository.findById(body.getRequestId())
                .orElseThrow(() -> new RuntimeException("Demande introuvable."));
        
        request.setRequestStatus(VerificationRequest.RequestStatus.ASSIGNED);
        // In a full implementation, we would set the assigned notary here
        return ResponseEntity.ok(requestRepository.save(request));
    }

    @Data
    public static class AssignNotaryRequest {
        private UUID requestId;
        private UUID notaryId;
    }
}
