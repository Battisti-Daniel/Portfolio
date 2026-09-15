package com.danielbattisti.portfolio.repository;

import com.danielbattisti.portfolio.model.BlogPost;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BlogPostRepository extends JpaRepository<BlogPost, Long> {
    List<BlogPost> findAllByPublishedTrueOrderByPublishedAtDesc();

    List<BlogPost> findAllByOrderByCreatedAtDesc();

    Optional<BlogPost> findBySlugAndPublishedTrue(String slug);

    boolean existsBySlug(String slug);

    boolean existsBySlugAndIdNot(String slug, Long id);
}
