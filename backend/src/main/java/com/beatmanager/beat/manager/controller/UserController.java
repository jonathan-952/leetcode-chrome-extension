package com.beatmanager.beat.manager.controller;
import org.springframework.security.core.AuthenticationException;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.beatmanager.beat.manager.DTO.LoginRequest;
import com.beatmanager.beat.manager.repository.UserRepository;
import com.beatmanager.beat.manager.repository.entity.Problem;
import com.beatmanager.beat.manager.repository.entity.User;
import com.beatmanager.beat.manager.service.ProblemService;
import com.beatmanager.beat.manager.service.UserService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/user")
public class UserController {
    

    @Autowired
    private UserService userService;

    @Autowired
    private ProblemService problemService;


    @PostMapping("/sign-up")
    public User createUser(@RequestBody User user) {
        return userService.saveUser(user);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest user) {
        String token = userService.verify(user);
        return ResponseEntity.ok(token);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<String> handleAuthenticationException(AuthenticationException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body("Invalid username or password");
    }

    @PostMapping("/submission")
    public ResponseEntity<?> addProblem(HttpServletRequest request, @RequestBody Problem payload) {

        System.out.println("payload: " + payload);

        problemService.saveProblem(payload, request.getHeader("Authorization"));

        return ResponseEntity.ok().build();

    }

    @GetMapping("/all_problems")
    public ResponseEntity<List<Problem>> all_problems(HttpServletRequest request) {
        List<Problem> problems = problemService.get_all_problems(request.getHeader("Authorization"));

        return ResponseEntity.ok(problems);
    }   
}


