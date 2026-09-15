package com.danielbattisti.portfolio.controller;

import com.danielbattisti.portfolio.dto.BlogPostDto;
import com.danielbattisti.portfolio.dto.BlogPostRequest;
import com.danielbattisti.portfolio.dto.BlogPostSummaryDto;
import com.danielbattisti.portfolio.exception.ResourceNotFoundException;
import com.danielbattisti.portfolio.model.BlogPost;
import com.danielbattisti.portfolio.repository.BlogPostRepository;
import jakarta.validation.Valid;
import java.text.Normalizer;
import java.time.Instant;
import java.util.List;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class BlogPostController {

    private final BlogPostRepository blogPostRepository;

    public BlogPostController(BlogPostRepository blogPostRepository) {
        this.blogPostRepository = blogPostRepository;
    }

    @GetMapping("/api/blog")
    public List<BlogPostSummaryDto> listPublished() {
        return blogPostRepository.findAllByPublishedTrueOrderByPublishedAtDesc().stream()
                .map(this::toSummaryDto)
                .toList();
    }

    @GetMapping("/api/blog/{slug}")
    public BlogPostDto getPublishedBySlug(@PathVariable String slug) {
        BlogPost post = blogPostRepository.findBySlugAndPublishedTrue(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Post não encontrado: " + slug));
        return toDto(post);
    }

    @GetMapping("/api/admin/blog")
    public List<BlogPostSummaryDto> listAllForAdmin() {
        return blogPostRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toSummaryDto)
                .toList();
    }

    @GetMapping("/api/admin/blog/{id}")
    public BlogPostDto getByIdForAdmin(@PathVariable Long id) {
        BlogPost post = blogPostRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post não encontrado: " + id));
        return toDto(post);
    }

    @PostMapping("/api/admin/blog")
    public BlogPostDto createPost(@Valid @RequestBody BlogPostRequest request) {
        String slug = resolveSlug(request.slug(), request.title(), null);
        BlogPost post = BlogPost.builder()
                .title(request.title())
                .slug(slug)
                .summary(request.summary())
                .content(request.content())
                .tags(request.tags())
                .published(request.published())
                .publishedAt(request.published() ? Instant.now() : null)
                .build();
        return toDto(blogPostRepository.save(post));
    }

    @PutMapping("/api/admin/blog/{id}")
    public BlogPostDto updatePost(@PathVariable Long id, @Valid @RequestBody BlogPostRequest request) {
        BlogPost post = blogPostRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post não encontrado: " + id));

        boolean wasPublished = post.isPublished();
        String slug = resolveSlug(request.slug(), request.title(), id);

        post.setTitle(request.title());
        post.setSlug(slug);
        post.setSummary(request.summary());
        post.setContent(request.content());
        post.setTags(request.tags());
        post.setPublished(request.published());
        if (request.published() && !wasPublished) {
            post.setPublishedAt(Instant.now());
        } else if (!request.published()) {
            post.setPublishedAt(null);
        }

        return toDto(blogPostRepository.save(post));
    }

    @DeleteMapping("/api/admin/blog/{id}")
    public void deletePost(@PathVariable Long id) {
        if (!blogPostRepository.existsById(id)) {
            throw new ResourceNotFoundException("Post não encontrado: " + id);
        }
        blogPostRepository.deleteById(id);
    }

    private String resolveSlug(String requestedSlug, String title, Long excludeId) {
        String base = slugify((requestedSlug != null && !requestedSlug.isBlank()) ? requestedSlug : title);
        String candidate = base;
        int suffix = 2;
        while (slugTakenByAnotherPost(candidate, excludeId)) {
            candidate = base + "-" + suffix++;
        }
        return candidate;
    }

    private boolean slugTakenByAnotherPost(String slug, Long excludeId) {
        return excludeId == null
                ? blogPostRepository.existsBySlug(slug)
                : blogPostRepository.existsBySlugAndIdNot(slug, excludeId);
    }

    private String slugify(String input) {
        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "");
        String slug = normalized.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .trim()
                .replaceAll("[\\s-]+", "-");
        return slug.isBlank() ? "post" : slug;
    }

    private BlogPostSummaryDto toSummaryDto(BlogPost p) {
        return new BlogPostSummaryDto(p.getId(), p.getTitle(), p.getSlug(), p.getSummary(), p.getTags(),
                p.isPublished(), p.getPublishedAt());
    }

    private BlogPostDto toDto(BlogPost p) {
        return new BlogPostDto(p.getId(), p.getTitle(), p.getSlug(), p.getSummary(), p.getContent(), p.getTags(),
                p.isPublished(), p.getPublishedAt(), p.getCreatedAt(), p.getUpdatedAt());
    }
}
