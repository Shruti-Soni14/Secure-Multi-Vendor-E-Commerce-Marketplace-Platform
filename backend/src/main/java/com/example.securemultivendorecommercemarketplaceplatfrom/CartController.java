package com.example.securemultivendorecommercemarketplaceplatform.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.example.securemultivendorecommercemarketplaceplatform.model.Cart;
import com.example.securemultivendorecommercemarketplaceplatform.repository.CartRepository;

@RestController
@RequestMapping("/cart")
@CrossOrigin(origins = "http://localhost:3000")
public class CartController {

    private final CartRepository repo;

    public CartController(CartRepository repo) {
        this.repo = repo;
    }

    // ADD TO CART
    @PostMapping
    public Cart add(@RequestBody Cart cart) {
        return repo.save(cart);
    }

    // GET CART BY USER
    @GetMapping("/{userId}")
    public List<Cart> get(@PathVariable Long userId) {
        return repo.findByUserId(userId);
    }

    //  REMOVE FROM CART
    @DeleteMapping("/{id}")
    public void remove(@PathVariable Long id) {
        repo.deleteById(id);
    }
}