package com.materre.controller;

import com.materre.model.Property;
import com.materre.repository.PropertyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/properties")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class PropertyController {

    private final PropertyRepository propertyRepository;

    @GetMapping("/certified")
    public ResponseEntity<List<Property>> getCertifiedProperties() {
        return ResponseEntity.ok(propertyRepository.findByCurrentStatus(Property.PropertyStatus.GREEN));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Property> getPropertyById(@PathVariable java.util.UUID id) {
        return propertyRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
