package com.danielbattisti.portfolio.dto;

import java.time.Instant;
import java.util.List;

public record ProjectDto(
        Long id,
        String title,
        String description,
        String imageUrl,
        String repoUrl,
        String demoUrl,
        List<String> techStack,
        boolean featured,
        Integer displayOrder,
        Instant createdAt) {
}
