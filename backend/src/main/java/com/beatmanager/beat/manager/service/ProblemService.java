package com.beatmanager.beat.manager.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.beatmanager.beat.manager.config.JWTFilter;
import com.beatmanager.beat.manager.repository.ProblemRepository;
import com.beatmanager.beat.manager.repository.entity.Problem;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class ProblemService {

    @Autowired
    private ProblemRepository problemRepo;

    @Autowired
    private JWTService jwtService;


    public Problem saveProblem(Problem payload, String authHeader) {

        String token = null;
        String username = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);

            username = jwtService.extractUsername(token);
        }

        Optional<Problem> duplicate = problemRepo.findByUserIDAndProblemID(username, payload.getProblemID());

        if (duplicate.isPresent()) {
            Problem exists = duplicate.get();

            // update fields: rating, notes, etc.
            exists.setNotes(payload.getNotes());
            exists.setRating(payload.getRating());

            return problemRepo.save(exists);
        }

        payload.setUserID(username);

        return problemRepo.save(payload);
    }

    public List<Problem> get_all_problems(String authHeader) {
        String token = null;
        String username = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);

            username = jwtService.extractUsername(token);
            return problemRepo.findAllByUserID(username);
        }

        throw new RuntimeException("Invalid or missing token");
    }

    public Optional<Problem> deleteProblem(Problem problem, String authHeader) {

        String token = null;
        String username = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);

            username = jwtService.extractUsername(token);

            return problemRepo.deleteByUserIDAndProblemID(username, problem.getProblemID());
        }
         throw new RuntimeException("Problem not found or invalid token");
        
    }

}
