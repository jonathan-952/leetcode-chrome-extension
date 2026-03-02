package com.beatmanager.beat.manager.service;

import org.springframework.security.core.AuthenticationException;

import java.util.Optional;
import java.util.UUID;

import org.deanframework.component.auth.exception.InvalidTokenException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.beatmanager.beat.manager.DTO.LoginRequest;
import com.beatmanager.beat.manager.repository.UserRepository;
import com.beatmanager.beat.manager.repository.entity.User;

import jakarta.mail.MessagingException;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    AuthenticationManager authManager;

    @Autowired
    JWTService jwtService;

    @Autowired
    private EmailService emailService;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(10);

    public void saveUser(User user) throws MessagingException {

        String token = UUID.randomUUID().toString();

        user.setVerificationToken(token);
        user.setEmailVerified(false);
        user.setPasswordHash(encoder.encode(user.getPasswordHash()));
        userRepo.save(user);
        emailService.sendVerificationEmail(user.getEmail(), token);

    }

    public String verify(LoginRequest user) {
        Optional<User> checkUserVerified = userRepo.findByUsername(user.getUsername());

        checkUserVerified.ifPresent(u -> {
            if (u.isEmailVerified() == false) {
                throw new RuntimeException("Email not verified");
                // do something
            }
        });
        
        authManager.authenticate(
            new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword())
        );

        return jwtService.generateToken(user.getUsername());
    }

    public void verifyEmail(String token) {

        User user = userRepo.findByVerificationToken(token)
            .orElseThrow(() -> new RuntimeException("Invalid token"));
        
        user.setEmailVerified(true);
        user.setVerificationToken(null);

        userRepo.save(user);
    }
 }
