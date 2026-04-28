package com.example.securemultivendorecommercemarketplaceplatform.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import com.example.securemultivendorecommercemarketplaceplatform.model.User;
import com.example.securemultivendorecommercemarketplaceplatform.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UserRepository repo;

    @Autowired
    private BCryptPasswordEncoder encoder;

    //  Browser test (optional)
    @GetMapping("/signup")
    public String test() {
        return "Signup API working";
    }

    //  SIGNUP
    @PostMapping("/signup")
    public String signup(@RequestBody User user) {

        User existing = repo.findByUsername(user.getUsername());

        if (existing != null) {
            return "User already exists";
        }

        // password encode
        user.setPassword(encoder.encode(user.getPassword()));

        // ROLE FIX (IMPORTANT)
        if (user.getRole() == null) {
            user.setRole("USER"); // default role
        }

        repo.save(user);

        return "Signup successful";
    }

    //  LOGIN
    @PostMapping("/login")
    public User login(@RequestBody User user) {

        User existing = repo.findByUsername(user.getUsername());

        if (existing != null && encoder.matches(user.getPassword(), existing.getPassword())) {
            return existing;
        } else {
            return null;
        }
    }
}