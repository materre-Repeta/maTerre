package com.materre.service;

import com.materre.model.User;
import com.materre.model.VerificationReport;
import com.materre.model.VerificationRequest;
import com.materre.repository.UserRepository;
import com.materre.repository.VerificationReportRepository;
import com.materre.repository.VerificationRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CommissionService {

    private final UserRepository userRepository;
    private final VerificationReportRepository reportRepository;
    private final VerificationRequestRepository requestRepository;

    private static final double COMMISSION_PERCENTAGE = 0.70; // 70% commission for Notary

    @Transactional
    public VerificationReport completeVerification(VerificationReport report, double totalFeePaid) {
        // 1. Calculate commission
        double commission = totalFeePaid * COMMISSION_PERCENTAGE;
        report.setCommissionAmount(commission);
        report.setPayoutStatus(VerificationReport.PayoutStatus.PENDING);
        
        // 2. Save report
        VerificationReport savedReport = reportRepository.save(report);

        // 3. Update Notary's total earnings
        User notary = savedReport.getNotary();
        double currentEarnings = notary.getTotalCommissionsEarned() != null ? notary.getTotalCommissionsEarned() : 0.0;
        notary.setTotalCommissionsEarned(currentEarnings + commission);
        userRepository.save(notary);

        // 4. Update Request status
        VerificationRequest request = savedReport.getRequest();
        request.setRequestStatus(VerificationRequest.RequestStatus.COMPLETED);
        requestRepository.save(request);

        return savedReport;
    }
}
