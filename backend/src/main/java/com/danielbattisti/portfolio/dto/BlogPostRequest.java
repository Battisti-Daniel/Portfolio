package com.danielbattisti.portfolio.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public record BlogPostRequest(
        @NotBlank(message = "Título é obrigatório") String title,
        String slug,
        @NotBlank(message = "Resumo é obrigatório") String summary,
        @NotBlank(message = "Conteúdo é obrigatório") String content,
        List<String> tags,
        boolean published) {
}
