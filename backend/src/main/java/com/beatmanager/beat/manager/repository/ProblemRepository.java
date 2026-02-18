package com.beatmanager.beat.manager.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.beatmanager.beat.manager.repository.entity.Problem;

@Repository
public interface ProblemRepository extends JpaRepository<Problem, Long> {

    Optional<Problem[]> findByUsername(String user_id);
  
}
  
