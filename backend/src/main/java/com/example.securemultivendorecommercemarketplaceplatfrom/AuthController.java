package com.example.securemultivendorecommercemarketplaceplatform.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import com.example.securemultivendorecommercemarketplaceplatform.model.User;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private BCryptPasswordEncoder encoder;

    //  TEST API
    @GetMapping("/test")
    public String test() {
        return "Auth API working";
    }

    //  SIGNUP (demo)
    @PostMapping("/signup")
    public User signup(@RequestBody User user) {

        User newUser = new User();
        newUser.setId(1L);
        newUser.setUsername(user.getUsername());

        // password encode (optional demo)
        newUser.setPassword(encoder.encode(user.getPassword()));

        newUser.setRole("USER");

        return newUser;
    }

    //  LOGIN (IMPORTANT FIXED)
    @PostMapping("/login")
    public User login(@RequestBody User user) {

        //  Demo login (no DB)
        User loggedInUser = new User();

        loggedInUser.setId(1L);
        loggedInUser.setUsername(user.getUsername());

        //  Role logic (for testing)
        if ("admin".equals(user.getUsername())) {
            loggedInUser.setRole("ADMIN");
        } else {
            loggedInUser.setRole("USER");
        }

        return loggedInUser;
    }
}
