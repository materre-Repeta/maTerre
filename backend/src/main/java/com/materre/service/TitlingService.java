package com.materre.service;

import com.materre.model.TitlingLog;
import com.materre.model.TitlingRequest;
import com.materre.model.User;
import com.materre.repository.TitlingLogRepository;
import com.materre.repository.TitlingRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TitlingService {

    private final TitlingRequestRepository requestRepository;
    private final TitlingLogRepository logRepository;

    @Transactional
    public TitlingRequest submitRequest(User requester, TitlingRequest.TitlingType type, String location, Double surface) {
        TitlingRequest request = TitlingRequest.builder()
                .requester(requester)
                .type(type)
                .propertyLocation(location)
                .surfaceArea(surface)
                .currentStep(TitlingRequest.TitlingStep.DOSSIER_SUBMITTED)
                .status(TitlingRequest.TitlingStatus.IN_PROGRESS)
                .build();
        
        TitlingRequest savedRequest = requestRepository.save(request);

        // Initial log entry
        TitlingLog logEntry = TitlingLog.builder()
                .request(savedRequest)
                .step(savedRequest.getCurrentStep())
                .adminComment("Dossier déposé sur maTerre. Initialisation de l'accompagnement.")
                .build();
        logRepository.save(logEntry);

        return savedRequest;
    }

    @Transactional
    public TitlingRequest updateStep(UUID requestId, TitlingRequest.TitlingStep nextStep, String comment) {
        TitlingRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Demande de titrage introuvable."));
        
        request.setCurrentStep(nextStep);
        if (nextStep == TitlingRequest.TitlingStep.COMPLETED) {
            request.setStatus(TitlingRequest.TitlingStatus.COMPLETED);
        }
        
        TitlingRequest updatedRequest = requestRepository.save(request);

        TitlingLog logEntry = TitlingLog.builder()
                .request(updatedRequest)
                .step(nextStep)
                .adminComment(comment)
                .build();
        logRepository.save(logEntry);

        return updatedRequest;
    }

    public List<TitlingRequest> getRequestsByUser(UUID userId) {
        return requestRepository.findByRequesterId(userId);
    }

    public List<TitlingLog> getLogsByRequest(UUID requestId) {
        return logRepository.findByRequestIdOrderByCreatedAtDesc(requestId);
    }
}
