package com.materre.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "titling_requests")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TitlingRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requester_id")
    private User requester;

    @Enumerated(EnumType.STRING)
    private TitlingType type;

    private String propertyLocation;
    private Double surfaceArea;

    @Enumerated(EnumType.STRING)
    private TitlingStep currentStep;

    @Enumerated(EnumType.STRING)
    private TitlingStatus status;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (currentStep == null) currentStep = TitlingStep.DOSSIER_SUBMITTED;
        if (status == null) status = TitlingStatus.IN_PROGRESS;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum TitlingType {
        CERTIFICATE_ONLY, FULL_TITLING
    }

    public enum TitlingStep {
        DOSSIER_SUBMITTED, FIELD_SURVEY, PUBLIC_NOTICE, FINAL_REVIEW, COMPLETED
    }

    public enum TitlingStatus {
        IN_PROGRESS, ON_HOLD, COMPLETED, REJECTED
    }
}
