package com.danielbattisti.portfolio.dto;

import java.time.Instant;
import java.util.List;

public record BlogPostDto(
        Long id,
        String title,
        String slug,
        String summary,
        String content,
        List<String> tags,
        boolean published,
        Instant publishedAt,
        Instant createdAt,
        Instant updatedAt) {
}
