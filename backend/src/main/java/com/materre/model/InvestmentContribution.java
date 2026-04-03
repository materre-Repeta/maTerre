package com.materre.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "investment_contributions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvestmentContribution {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private InvestmentProject project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "investor_id")
    private User investor;

    private Double amount; // XAF

    @Enumerated(EnumType.STRING)
    private ContributionStatus status;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) status = ContributionStatus.PENDING;
    }

    public enum ContributionStatus {
        PENDING, CONFIRMED, CANCELLED
    }
}
