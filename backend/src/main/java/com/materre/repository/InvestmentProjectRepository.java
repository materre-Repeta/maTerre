package com.materre.repository;

import com.materre.model.InvestmentProject;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface InvestmentProjectRepository extends JpaRepository<InvestmentProject, UUID> {
    List<InvestmentProject> findByStatus(InvestmentProject.ProjectStatus status);
    List<InvestmentProject> findByOwnerId(UUID ownerId);
}
