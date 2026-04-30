package com.example.securemultivendorecommercemarketplaceplatform.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.securemultivendorecommercemarketplaceplatform.model.User;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*") // render ke liye better
public class AuthController {

    @Autowired
    private BCryptPasswordEncoder encoder;

    // TEST
    @GetMapping("/signup")
    public String test() {
        return "Signup API working";
    }

    // SIGNUP (dummy)
    @PostMapping("/signup")
    public String signup(@RequestBody User user) {

        String encodedPassword = encoder.encode(user.getPassword());

        return "Signup successful (demo mode)";
    }

    // LOGIN (dummy)
    @PostMapping("/login")
    public String login(@RequestBody User user) {

        return "Login successful (demo mode)";
    }
}
