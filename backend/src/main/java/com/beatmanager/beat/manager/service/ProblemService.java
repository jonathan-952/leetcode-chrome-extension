package com.beatmanager.beat.manager.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.beatmanager.beat.manager.repository.ProblemRepository;
import com.beatmanager.beat.manager.repository.entity.Problem;

@Service
public class ProblemService {

    @Autowired
    private ProblemRepository problemRepo;


    public Problem saveProblem(Problem payload) {
        return problemRepo.save(payload);
    }

}
