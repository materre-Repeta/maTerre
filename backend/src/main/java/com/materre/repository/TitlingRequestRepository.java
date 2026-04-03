package com.materre.repository;

import com.materre.model.TitlingRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface TitlingRequestRepository extends JpaRepository<TitlingRequest, UUID> {
    List<TitlingRequest> findByRequesterId(UUID requesterId);
}
