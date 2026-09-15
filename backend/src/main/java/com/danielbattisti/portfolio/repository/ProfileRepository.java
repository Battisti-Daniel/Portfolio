package com.danielbattisti.portfolio.repository;

import com.danielbattisti.portfolio.model.Profile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfileRepository extends JpaRepository<Profile, Long> {
}
