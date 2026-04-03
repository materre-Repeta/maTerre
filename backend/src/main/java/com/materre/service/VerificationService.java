package com.materre.service;

import com.materre.model.Property;
import com.materre.model.VerificationRequest;
import com.materre.model.VerificationReport;
import com.materre.repository.PropertyRepository;
import com.materre.repository.VerificationRequestRepository;
import com.materre.repository.VerificationReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VerificationService {

    private final VerificationRequestRepository requestRepository;
    private final VerificationReportRepository reportRepository;
    private final PropertyRepository propertyRepository;

    @Transactional
    public VerificationRequest submitRequest(String titleNumber, UUID requesterId) {
        VerificationRequest request = VerificationRequest.builder()
                .titleNumber(titleNumber)
                .requestStatus(VerificationRequest.RequestStatus.PENDING)
                .paymentStatus(VerificationRequest.PaymentStatus.UNPAID)
                .build();
        // In a real app, we'd set the requester from the User repository
        return requestRepository.save(request);
    }

    public Optional<VerificationReport> getReportByRequestId(UUID requestId) {
        return reportRepository.findByRequestId(requestId);
    }

    public Optional<Property> checkPropertyStatus(String titleNumber) {
        return propertyRepository.findByTitleNumber(titleNumber);
    }
}
