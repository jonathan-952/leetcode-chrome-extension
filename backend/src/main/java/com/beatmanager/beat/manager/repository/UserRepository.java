package com.beatmanager.beat.manager.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.beatmanager.beat.manager.repository.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    Optional<User> findByVerificationToken(String token);

    Optional<User> findByEmail(String email);
  
}

// when i get back:
//  add checks for duplicate emails and usernames on sign up