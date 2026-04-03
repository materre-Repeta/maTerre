package com.materre.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "investment_projects")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvestmentProject {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    private User owner;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "titling_request_id")
    private TitlingRequest titlingRequest;

    private Double totalFundingNeeded; // XAF
    private Double currentFundingRaised; // XAF

    @Enumerated(EnumType.STRING)
    private RepaymentModel repaymentModel;

    private Double totalLandPortionToShare; // % of land given by owner to the pool

    @Enumerated(EnumType.STRING)
    private ProjectStatus status;

    private Boolean isExclusive;
    private LocalDateTime publishedAt;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (currentFundingRaised == null) currentFundingRaised = 0.0;
        if (status == null) status = ProjectStatus.FUNDING_OPEN;
        if (isExclusive == null) isExclusive = false;
        if (publishedAt == null) publishedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum RepaymentModel {
        LAND_PORTION, SALE_COMMISSION
    }

    public enum ProjectStatus {
        FUNDING_OPEN, FUNDED, ACTIVE, COMPLETED, REPAID
    }
}
