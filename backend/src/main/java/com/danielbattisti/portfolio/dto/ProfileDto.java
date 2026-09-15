package com.danielbattisti.portfolio.dto;

import java.time.Instant;

public record ProfileDto(
        Long id,
        String name,
        String title,
        String bio,
        String email,
        String location,
        String avatarUrl,
        String githubUrl,
        String linkedinUrl,
        String xUrl,
        Instant updatedAt) {
}
