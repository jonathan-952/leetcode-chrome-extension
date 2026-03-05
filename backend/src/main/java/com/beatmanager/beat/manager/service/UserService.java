package com.beatmanager.beat.manager.service;

import org.springframework.security.core.AuthenticationException;

import java.util.Optional;
import java.util.UUID;

import javax.management.RuntimeErrorException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.beatmanager.beat.manager.DTO.LoginRequest;
import com.beatmanager.beat.manager.DTO.RegistrationRequest;
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

    public void saveUser(RegistrationRequest user) throws MessagingException {
        String hashedPassword = encoder.encode(user.getPassword().trim());

        User newUser = new User(
            user.getUsername(), 
            user.getEmail(),
            // dont add plain password to this user object?
            hashedPassword);
        
        Optional<User> usernameExists = userRepo.findByUsername(newUser.getUsername().trim());

        Optional<User> emailExists = userRepo.findByEmail(newUser.getEmail().trim());

        if (usernameExists.isPresent()) {
            throw new RuntimeException("Username taken");
        } 

        if (emailExists.isPresent()) {
            throw new RuntimeException("Email already exists");
        } 

        String token = UUID.randomUUID().toString();

    
        newUser.setVerificationToken(token);
        newUser.setEmailVerified(false);
        newUser.setPasswordHash(hashedPassword);
        userRepo.save(newUser);
        emailService.sendVerificationEmail(newUser.getEmail(), token);

    }

    public String verify(LoginRequest user) {
        Optional<User> checkUserVerified = userRepo.findByUsername(user.getUsername());

        checkUserVerified.ifPresent(u -> {
            // if we can find user AND that user is verified -> generate JWT token
            if (u.isEmailVerified() == false) {
                throw new RuntimeException("Email not verified");
          
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