package com.materre.repository;

import com.materre.model.InvestmentContribution;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface InvestmentContributionRepository extends JpaRepository<InvestmentContribution, UUID> {
    List<InvestmentContribution> findByProjectId(UUID projectId);
    List<InvestmentContribution> findByInvestorId(UUID investorId);
}
