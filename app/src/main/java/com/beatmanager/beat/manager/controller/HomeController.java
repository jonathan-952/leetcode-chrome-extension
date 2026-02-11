package com.beatmanager.beat.manager.controller;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.beatmanager.beat.manager.repository.UserRepository;
import com.beatmanager.beat.manager.repository.entity.User;

@RestController
@RequestMapping("/user")
public class HomeController {

    private final UserRepository userRepo;

    public HomeController(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    @PostMapping("/sign-up")
    public User createUser(@RequestBody User user) {
        return userRepo.save(user);
    }
}


