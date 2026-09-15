package com.danielbattisti.portfolio.repository;

import com.danielbattisti.portfolio.model.Plan;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlanRepository extends JpaRepository<Plan, Long> {
    List<Plan> findAllByOrderByDisplayOrderAscCreatedAtDesc();
}
