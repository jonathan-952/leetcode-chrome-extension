package com.beatmanager.beat.manager.repository.entity;

import java.sql.Date;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.LastModifiedDate;

import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;

@Entity(name = "problem")
public class Problem {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  
  @Column(name = "problem_id", nullable = false, unique = false)
  private String problemID;

  @Column(nullable = true, unique = false)
  private String notes;

  @Column(nullable = false)
  private Integer rating;

  @Column(name = "last_submitted", nullable = false)
  private LocalDateTime lastSubmitted;

  @Column(name = "user_id", nullable = false, unique = false)
  private String userID;

  @ElementCollection
  private List<String> topics;

  public void setUserID(String userID) {
    this.userID = userID;
  }

  public void setRating(Integer rating) {
    this.rating = rating;
  }

  public void setNotes(String notes) {
    this.notes = notes;
  }

  @PrePersist
  public void prePersist() {
      lastSubmitted = LocalDateTime.now();
  }

  @PreUpdate
  public void preUpdate() {
      lastSubmitted = LocalDateTime.now();
  }

  public String getProblemID() {
    return problemID;
  }

  public String getNotes() {
    return notes;
  }

  public Integer getRating() {
    return rating;
  }

protected Problem() {}

public Problem(List<String> topics, Integer rating, String problemID, String notes, String userID) {
    this.problemID = problemID;
    this.notes = notes;
    this.userID = userID;
    this.topics = topics;
    this.rating = rating;
}

}


// when i get back from break -> work on dashboard
// get user rating, notes, etc.
