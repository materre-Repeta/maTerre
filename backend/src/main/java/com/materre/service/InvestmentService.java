package com.materre.service;

import com.materre.model.InvestmentContribution;
import com.materre.model.InvestmentProject;
import com.materre.model.TitlingRequest;
import com.materre.model.User;
import com.materre.repository.InvestmentContributionRepository;
import com.materre.repository.InvestmentProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class InvestmentService {

    private final InvestmentProjectRepository projectRepository;
    private final InvestmentContributionRepository contributionRepository;

    @Transactional
    public InvestmentProject createProject(User owner, TitlingRequest request, Double fundingNeeded, Double landPortion) {
        InvestmentProject project = InvestmentProject.builder()
                .owner(owner)
                .titlingRequest(request)
                .totalFundingNeeded(fundingNeeded)
                .currentFundingRaised(0.0)
                .totalLandPortionToShare(landPortion)
                .status(InvestmentProject.ProjectStatus.FUNDING_OPEN)
                .build();
        return projectRepository.save(project);
    }

    @Transactional
    public InvestmentContribution contribute(User investor, UUID projectId, Double amount) {
        InvestmentProject project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Projet introuvable."));

        InvestmentContribution contribution = InvestmentContribution.builder()
                .project(project)
                .investor(investor)
                .amount(amount)
                .status(InvestmentContribution.ContributionStatus.CONFIRMED)
                .build();

        // Update Project funding progress
        project.setCurrentFundingRaised(project.getCurrentFundingRaised() + amount);
        if (project.getCurrentFundingRaised() >= project.getTotalFundingNeeded()) {
            project.setStatus(InvestmentProject.ProjectStatus.FUNDED);
        }
        projectRepository.save(project);

        return contributionRepository.save(contribution);
    }

    public List<InvestmentProject> getOpenProjects() {
        return projectRepository.findByStatus(InvestmentProject.ProjectStatus.FUNDING_OPEN);
    }

    public List<InvestmentContribution> getMyInvestments(UUID investorId) {
        return contributionRepository.findByInvestorId(investorId);
    }
}
