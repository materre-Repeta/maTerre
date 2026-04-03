package com.materre.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "verification_reports")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VerificationReport {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "request_id")
    private VerificationRequest request;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "notary_id")
    private User notary;

    @Column(columnDefinition = "TEXT")
    private String historicalSummary;

    @Column(columnDefinition = "TEXT")
    private String preNotations;

    @Column(columnDefinition = "TEXT")
    private String disputesLitiges;

    @Column(columnDefinition = "TEXT")
    private String liensHypotheques;

    @Enumerated(EnumType.STRING)
    private Property.PropertyStatus verdict;

    private Double commissionAmount;
    @Enumerated(EnumType.STRING)
    private PayoutStatus payoutStatus;

    private String reportPdfUrl;
    private LocalDateTime verifiedAt;

    @PrePersist
    protected void onCreate() {
        verifiedAt = LocalDateTime.now();
        if (payoutStatus == null) payoutStatus = PayoutStatus.PENDING;
    }

    public enum PayoutStatus {
        PENDING, PAID
    }
}
