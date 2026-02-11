package com.beatmanager.beat.manager.repository.entity;

import java.time.Instant;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

@Entity(name = "users")
public class User {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = true)
  private String email;

  @Column(name = "password", nullable = true)
  private String passwordHash;

  @Column(name = "username", nullable = false)
  private String username;

  public User(String username, String email, String password) {
    this.username = username;
    this.email = email;
    this.passwordHash = password;

  }

  protected User() {

  }

  public String getEmail() {
    return email;
  }

  public String getUsername() {
    return username;
  }
  



}
 