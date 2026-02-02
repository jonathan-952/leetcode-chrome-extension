package com.beatmanager.beat.manager;

import java.time.Instant;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity(name = "users")
public class User {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = true)
  private String email;

  @Column(name = "password_hash", nullable = true)
  private String passwordHash;

  @Column(name = "leetcode_problems", nullable = true)
  private List<Problem> problems;

  @Column(name = "username", nullable = false)
  private String username;

  protected User(String username, String email, String password) {
    this.username = username;
    this.email = email;
    this.passwordHash = password;

  }

  public String getEmail() {
    return email;
  }

  public List<Problem> getProblems() {
    return problems;
  }

  public String getUsername() {
    return username;
  }

  public User() {

  }

  



}
 