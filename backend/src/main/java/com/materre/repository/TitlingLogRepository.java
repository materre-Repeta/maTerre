package com.materre.repository;

import com.materre.model.TitlingLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface TitlingLogRepository extends JpaRepository<TitlingLog, UUID> {
    List<TitlingLog> findByRequestIdOrderByCreatedAtDesc(UUID requestId);
}
