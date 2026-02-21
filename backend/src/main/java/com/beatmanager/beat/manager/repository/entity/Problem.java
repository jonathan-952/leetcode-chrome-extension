package com.beatmanager.beat.manager.repository.entity;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity(name = "problem")
public class Problem {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  
  @Column(name = "problem_id", nullable = false, unique = false)
  private String problemID;

  @Column(nullable = true, unique = false)
  private String notes;

  @Column(name = "user_id", nullable = false, unique = false)
  private String userID;

  @Column(name = "topics", nullable = true, unique = false)
  @ElementCollection
  private List<String> topics;

  public void setUserID(String userID) {
    this.userID = userID;
  }

  public String getProblemID() {
    return problemID;
  }

protected Problem() {}

public Problem(String problemID, String notes, String userID) {
    this.problemID = problemID;
    this.notes = notes;
    this.userID = userID;

}

}


// when i get back from break -> work on dashboard
// get user rating, notes, etc.
