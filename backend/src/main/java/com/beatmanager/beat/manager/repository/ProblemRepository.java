package com.beatmanager.beat.manager.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.beatmanager.beat.manager.repository.entity.Problem;

import jakarta.transaction.Transactional;

@Repository
public interface ProblemRepository extends JpaRepository<Problem, Long> {

    Optional<List<Problem>> findByUserID(String userID);

    Optional<Problem> findByUserIDAndProblemID(String userID, String problemID);

    List<Problem> findAllByUserID(String userID);

    Optional<Problem> deleteByUserIDAndProblemID(String userID, String problemID);
  
}
  
