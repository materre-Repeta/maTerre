package com.materre.controller;

import com.materre.model.InvestmentContribution;
import com.materre.model.InvestmentProject;
import com.materre.model.TitlingRequest;
import com.materre.model.User;
import com.materre.service.InvestmentService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/investment")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class InvestmentController {

    private final InvestmentService investmentService;

    @PostMapping("/apply")
    public ResponseEntity<InvestmentProject> applyForFinancing(
            @AuthenticationPrincipal User owner,
            @RequestBody InvestmentApplyRequest body
    ) {
        // Mock request for prototype
        TitlingRequest mockReq = TitlingRequest.builder().id(body.getTitlingRequestId()).surfaceArea(1000.0).build();

        return ResponseEntity.ok(investmentService.createProject(
                owner, mockReq, body.getFundingNeeded(), body.getPercentage()
        ));
    }

    @GetMapping("/open-projects")
    public ResponseEntity<List<InvestmentProject>> getOpenProjects() {
        return ResponseEntity.ok(investmentService.getOpenProjects());
    }

    @PostMapping("/contribute")
    public ResponseEntity<InvestmentContribution> contribute(
            @AuthenticationPrincipal User investor,
            @RequestBody ContributeRequest body
    ) {
        return ResponseEntity.ok(investmentService.contribute(investor, body.getProjectId(), body.getAmount()));
    }

    @Data
    public static class ContributeRequest {
        private UUID projectId;
        private Double amount;
    }

    @Data
    public static class InvestmentApplyRequest {
        private UUID titlingRequestId;
        private InvestmentProject.RepaymentModel model;
        private Double fundingNeeded;
        private Double percentage;
    }
}
