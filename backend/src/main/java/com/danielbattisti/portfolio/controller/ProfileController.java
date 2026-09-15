package com.danielbattisti.portfolio.controller;

import com.danielbattisti.portfolio.dto.ProfileDto;
import com.danielbattisti.portfolio.dto.ProfileRequest;
import com.danielbattisti.portfolio.exception.ResourceNotFoundException;
import com.danielbattisti.portfolio.model.Profile;
import com.danielbattisti.portfolio.repository.ProfileRepository;
import jakarta.validation.Valid;
import java.time.Instant;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ProfileController {

    private final ProfileRepository profileRepository;

    public ProfileController(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    @GetMapping("/api/profile")
    public ProfileDto getProfile() {
        Profile profile = profileRepository.findAll().stream().findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Perfil ainda não configurado"));
        return toDto(profile);
    }

    @PutMapping("/api/admin/profile")
    public ProfileDto updateProfile(@Valid @RequestBody ProfileRequest request) {
        Profile profile = profileRepository.findAll().stream().findFirst()
                .orElseGet(Profile::new);

        profile.setName(request.name());
        profile.setTitle(request.title());
        profile.setBio(request.bio());
        profile.setEmail(request.email());
        profile.setLocation(request.location());
        profile.setAvatarUrl(request.avatarUrl());
        profile.setGithubUrl(request.githubUrl());
        profile.setLinkedinUrl(request.linkedinUrl());
        profile.setXUrl(request.xUrl());
        profile.setUpdatedAt(Instant.now());

        return toDto(profileRepository.save(profile));
    }

    private ProfileDto toDto(Profile p) {
        return new ProfileDto(p.getId(), p.getName(), p.getTitle(), p.getBio(), p.getEmail(), p.getLocation(),
                p.getAvatarUrl(), p.getGithubUrl(), p.getLinkedinUrl(), p.getXUrl(), p.getUpdatedAt());
    }
}
