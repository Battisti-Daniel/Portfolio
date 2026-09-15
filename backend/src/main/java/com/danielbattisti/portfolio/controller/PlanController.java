package com.danielbattisti.portfolio.controller;

import com.danielbattisti.portfolio.dto.PlanDto;
import com.danielbattisti.portfolio.dto.PlanRequest;
import com.danielbattisti.portfolio.exception.ResourceNotFoundException;
import com.danielbattisti.portfolio.model.Plan;
import com.danielbattisti.portfolio.repository.PlanRepository;
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
public class PlanController {

    private final PlanRepository planRepository;

    public PlanController(PlanRepository planRepository) {
        this.planRepository = planRepository;
    }

    @GetMapping("/api/plans")
    public List<PlanDto> listPlans() {
        return planRepository.findAllByOrderByDisplayOrderAscCreatedAtDesc().stream()
                .map(this::toDto)
                .toList();
    }

    @PostMapping("/api/admin/plans")
    public PlanDto createPlan(@Valid @RequestBody PlanRequest request) {
        Plan plan = Plan.builder()
                .title(request.title())
                .description(request.description())
                .status(request.status())
                .targetDate(request.targetDate())
                .displayOrder(request.displayOrder() != null ? request.displayOrder() : 0)
                .build();
        return toDto(planRepository.save(plan));
    }

    @PutMapping("/api/admin/plans/{id}")
    public PlanDto updatePlan(@PathVariable Long id, @Valid @RequestBody PlanRequest request) {
        Plan plan = planRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Plano não encontrado: " + id));

        plan.setTitle(request.title());
        plan.setDescription(request.description());
        plan.setStatus(request.status());
        plan.setTargetDate(request.targetDate());
        plan.setDisplayOrder(request.displayOrder() != null ? request.displayOrder() : 0);

        return toDto(planRepository.save(plan));
    }

    @DeleteMapping("/api/admin/plans/{id}")
    public void deletePlan(@PathVariable Long id) {
        if (!planRepository.existsById(id)) {
            throw new ResourceNotFoundException("Plano não encontrado: " + id);
        }
        planRepository.deleteById(id);
    }

    private PlanDto toDto(Plan p) {
        return new PlanDto(p.getId(), p.getTitle(), p.getDescription(), p.getStatus(), p.getTargetDate(),
                p.getDisplayOrder(), p.getCreatedAt());
    }
}
