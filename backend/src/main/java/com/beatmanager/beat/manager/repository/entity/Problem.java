package com.beatmanager.beat.manager.repository.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity(name = "problem")
public class Problem {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  
  @Column(nullable = false, unique = false)
  private String problem_id;

  @Column(nullable = true, unique = false)
  private String notes;

  @Column(nullable = false, unique = false)
  private String user_id;

protected Problem() {}

public Problem(String problem_id, String notes, String user_id) {
    this.problem_id = problem_id;
    this.notes = notes;
    this.user_id = user_id;

}

}