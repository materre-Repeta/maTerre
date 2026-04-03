package com.materre.repository;

import com.materre.model.VerificationReport;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface VerificationReportRepository extends JpaRepository<VerificationReport, UUID> {
    Optional<VerificationReport> findByRequestId(UUID requestId);
}
