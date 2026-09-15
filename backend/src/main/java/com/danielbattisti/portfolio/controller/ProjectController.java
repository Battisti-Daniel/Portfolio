package com.danielbattisti.portfolio.controller;

import com.danielbattisti.portfolio.dto.ProjectDto;
import com.danielbattisti.portfolio.dto.ProjectRequest;
import com.danielbattisti.portfolio.exception.ResourceNotFoundException;
import com.danielbattisti.portfolio.model.Project;
import com.danielbattisti.portfolio.repository.ProjectRepository;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ProjectController {

    private final ProjectRepository projectRepository;

    public ProjectController(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    @GetMapping("/api/projects")
    public List<ProjectDto> listProjects() {
        return projectRepository.findAllByOrderByDisplayOrderAscCreatedAtDesc().stream()
                .map(this::toDto)
                .toList();
    }

    @PostMapping("/api/admin/projects")
    public ProjectDto createProject(@Valid @RequestBody ProjectRequest request) {
        Project project = Project.builder()
                .title(request.title())
                .description(request.description())
                .imageUrl(request.imageUrl())
                .repoUrl(request.repoUrl())
                .demoUrl(request.demoUrl())
                .techStack(request.techStack())
                .featured(request.featured())
                .displayOrder(request.displayOrder() != null ? request.displayOrder() : 0)
                .build();
        return toDto(projectRepository.save(project));
    }

    @PutMapping("/api/admin/projects/{id}")
    public ProjectDto updateProject(@PathVariable Long id, @Valid @RequestBody ProjectRequest request) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Projeto não encontrado: " + id));

        project.setTitle(request.title());
        project.setDescription(request.description());
        project.setImageUrl(request.imageUrl());
        project.setRepoUrl(request.repoUrl());
        project.setDemoUrl(request.demoUrl());
        project.setTechStack(request.techStack());
        project.setFeatured(request.featured());
        project.setDisplayOrder(request.displayOrder() != null ? request.displayOrder() : 0);

        return toDto(projectRepository.save(project));
    }

    @DeleteMapping("/api/admin/projects/{id}")
    public void deleteProject(@PathVariable Long id) {
        if (!projectRepository.existsById(id)) {
            throw new ResourceNotFoundException("Projeto não encontrado: " + id);
        }
        projectRepository.deleteById(id);
    }

    private ProjectDto toDto(Project p) {
        return new ProjectDto(p.getId(), p.getTitle(), p.getDescription(), p.getImageUrl(), p.getRepoUrl(),
                p.getDemoUrl(), p.getTechStack(), p.isFeatured(), p.getDisplayOrder(), p.getCreatedAt());
    }
}
