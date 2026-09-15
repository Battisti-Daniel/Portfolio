package com.danielbattisti.portfolio.dto;

import jakarta.validation.constraints.NotBlank;

public record ProfileRequest(
        @NotBlank(message = "Nome é obrigatório") String name,
        @NotBlank(message = "Título é obrigatório") String title,
        @NotBlank(message = "Bio é obrigatória") String bio,
        String email,
        String location,
        String avatarUrl,
        String githubUrl,
        String linkedinUrl,
        String xUrl) {
}
