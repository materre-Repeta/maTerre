package com.materre.controller;

import com.materre.model.TitlingLog;
import com.materre.model.TitlingRequest;
import com.materre.model.User;
import com.materre.service.TitlingService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/titling")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class TitlingController {

    private final TitlingService titlingService;

    @PostMapping("/request")
    public ResponseEntity<TitlingRequest> submitRequest(
            @AuthenticationPrincipal User requester,
            @RequestBody TitlingSubmitRequest body
    ) {
        TitlingRequest request = titlingService.submitRequest(
                requester, body.getType(), body.getLocation(), body.getSurface()
        );
        return ResponseEntity.ok(request);
    }

    @GetMapping("/my-requests")
    public ResponseEntity<List<TitlingRequest>> getMyRequests(@AuthenticationPrincipal User requester) {
        return ResponseEntity.ok(titlingService.getRequestsByUser(requester.getId()));
    }

    @GetMapping("/logs/{requestId}")
    public ResponseEntity<List<TitlingLog>> getLogs(@PathVariable UUID requestId) {
        return ResponseEntity.ok(titlingService.getLogsByRequest(requestId));
    }

    @PatchMapping("/update/{requestId}")
    public ResponseEntity<TitlingRequest> updateStep(
            @PathVariable UUID requestId,
            @RequestBody TitlingUpdateBody body
    ) {
        return ResponseEntity.ok(titlingService.updateStep(requestId, body.getNextStep(), body.getComment()));
    }

    @Data
    public static class TitlingSubmitRequest {
        private TitlingRequest.TitlingType type;
        private String location;
        private Double surface;
    }

    @Data
    public static class TitlingUpdateBody {
        private TitlingRequest.TitlingStep nextStep;
        private String comment;
    }
}
