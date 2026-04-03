package com.materre.repository;

import com.materre.model.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PropertyRepository extends JpaRepository<Property, UUID> {
    Optional<Property> findByTitleNumber(String titleNumber);
    List<Property> findByCurrentStatus(Property.PropertyStatus status);
}
