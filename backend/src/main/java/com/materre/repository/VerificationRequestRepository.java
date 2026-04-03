package com.materre.repository;

import com.materre.model.VerificationRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface VerificationRequestRepository extends JpaRepository<VerificationRequest, UUID> {
    List<VerificationRequest> findByRequesterId(UUID requesterId);
    List<VerificationRequest> findByTitleNumber(String titleNumber);
    List<VerificationRequest> findByRequestStatus(VerificationRequest.RequestStatus status);
}
