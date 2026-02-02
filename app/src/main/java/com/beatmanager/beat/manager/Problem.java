package com.beatmanager.beat.manager;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity(name = "problem")
public class Problem {

// leetcode problem id
// rating
// notes
// 
  @Column(nullable = false, unique = true)
  private String name;
  @Column(nullable = true, unique = false)
  private String notes;

  @Column(nullable = false, unique = true)
  private Integer number;

  @Column(nullable = false, unique = false)
  private String user_id;

protected Problem() {}

public Problem(String name, String notes, String user_id, Integer number) {
    this.name = name;
    this.notes = notes;
    this.number = number;
    this.user_id = user_id;

}

}