package com.materre.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "properties")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Property {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true, nullable = false)
    private String titleNumber;

    private String locationCity;
    private String locationQuarter;
    private Double surfaceArea;
    private String currentOwnerName;

    @Enumerated(EnumType.STRING)
    private PropertyStatus currentStatus;

    private Double price;
    @Column(columnDefinition = "TEXT")
    private String description;
    private String imageUrl;

    private LocalDateTime lastVerifiedAt;
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (currentStatus == null) {
            currentStatus = PropertyStatus.UNKNOWN;
        }
    }

    public enum PropertyStatus {
        GREEN, YELLOW, RED, UNKNOWN, FOR_SALE
    }
}
