package com.materre.controller;

import com.materre.model.Property;
import com.materre.model.VerificationRequest;
import com.materre.model.VerificationReport;
import com.materre.service.PdfGeneratorService;
import com.materre.service.VerificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/verify")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200") // For Angular development
public class VerificationController {

    private final VerificationService verificationService;
    private final PdfGeneratorService pdfGeneratorService;

    @PostMapping("/request")
    public ResponseEntity<VerificationRequest> submitRequest(@RequestParam String titleNumber) {
        // For prototype, requesterId is null
        VerificationRequest request = verificationService.submitRequest(titleNumber, null);
        return ResponseEntity.ok(request);
    }

    @GetMapping("/report/{requestId}/download")
    public ResponseEntity<byte[]> downloadReport(@PathVariable UUID requestId) {
        return verificationService.getReportByRequestId(requestId)
                .map(report -> {
                    byte[] pdf = pdfGeneratorService.generateVerificationReport(report);
                    return ResponseEntity.ok()
                            .header("Content-Type", "application/pdf")
                            .header("Content-Disposition", "attachment; filename=rapport_maTerre_" + report.getRequest().getTitleNumber() + ".pdf")
                            .body(pdf);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/status/{titleNumber}")
    public ResponseEntity<Property> getPropertyStatus(@PathVariable String titleNumber) {
        return verificationService.checkPropertyStatus(titleNumber)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/report/{requestId}")
    public ResponseEntity<VerificationReport> getReport(@PathVariable UUID requestId) {
        return verificationService.getReportByRequestId(requestId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
