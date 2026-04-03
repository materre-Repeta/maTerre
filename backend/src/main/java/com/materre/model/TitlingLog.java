package com.materre.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "titling_logs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TitlingLog {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "request_id")
    private TitlingRequest request;

    @Enumerated(EnumType.STRING)
    private TitlingRequest.TitlingStep step;

    @Column(columnDefinition = "TEXT")
    private String adminComment;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
