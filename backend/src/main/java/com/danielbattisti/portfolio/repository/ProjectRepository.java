package com.danielbattisti.portfolio.repository;

import com.danielbattisti.portfolio.model.Project;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findAllByOrderByDisplayOrderAscCreatedAtDesc();
}
