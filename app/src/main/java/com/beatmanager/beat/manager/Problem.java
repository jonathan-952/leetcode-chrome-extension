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
  @Column(nullable = true, unique = true)
  private String notes;

  @Column(nullable = false, unique = false)
  private String user_id;
}
