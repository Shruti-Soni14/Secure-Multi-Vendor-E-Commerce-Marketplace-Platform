package com.example.securemultivendorecommercemarketplaceplatform.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cart")
@CrossOrigin(origins = "*")
public class CartController {

    // GET cart
    @GetMapping("/{userId}")
    public String getCart(@PathVariable Long userId) {
        return "Cart items (demo mode)";
    }

    // ADD to cart
    @PostMapping
    public String addToCart() {
        return "Item added to cart (demo mode)";
    }

    // DELETE from cart
    @DeleteMapping("/{id}")
    public String removeFromCart(@PathVariable Long id) {
        return "Item removed from cart (demo mode)";
    }
}
