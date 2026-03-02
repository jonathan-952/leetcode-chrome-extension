package com.beatmanager.beat.manager.repository.entity;

import java.time.Instant;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity(name = "users")
public class User {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = true)
  private String email;

  @Column(name = "email_verified", nullable = false)
  private boolean emailVerified = false;

  @Column(name = "verification_token")
  private String verificationToken; 

  @Column(name = "password", nullable = false)
  private String passwordHash;

  @Column(name = "username", unique = true, nullable = false)
  private String username;

  public User(String username, String email, String password) {
    this.username = username;
    this.email = email;
    this.passwordHash = password;

  }

  protected User() {

  }

 
}
 