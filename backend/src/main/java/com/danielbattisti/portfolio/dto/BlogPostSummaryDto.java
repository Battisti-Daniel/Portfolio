package com.danielbattisti.portfolio.dto;

import java.time.Instant;
import java.util.List;

public record BlogPostSummaryDto(
        Long id,
        String title,
        String slug,
        String summary,
        List<String> tags,
        boolean published,
        Instant publishedAt) {
}
