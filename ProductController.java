package com.example.securemultivendorecommercemarketplaceplatform.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;

import com.example.securemultivendorecommercemarketplaceplatform.model.Product;
import com.example.securemultivendorecommercemarketplaceplatform.model.User;
import com.example.securemultivendorecommercemarketplaceplatform.repository.ProductRepository;
import com.example.securemultivendorecommercemarketplaceplatform.repository.UserRepository;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {

    private final ProductRepository repo;
    private final UserRepository userRepo;

    public ProductController(ProductRepository repo, UserRepository userRepo) {
        this.repo = repo;
        this.userRepo = userRepo;
    }

    //  GET ALL PRODUCTS
    @GetMapping("/products")
    public List<Product> getAllProducts() {
        return repo.findAll();
    }

    // GET PRODUCTS BY USER
    @GetMapping("/products/{userId}")
    public List<Product> getProducts(@PathVariable Long userId) {
        return repo.findByUserId(userId);
    }

    //  ADD PRODUCT
    @PostMapping("/products/{userId}")
    public Product addProduct(@PathVariable Long userId, @RequestBody Product p) {
        User user = userRepo.findById(userId).orElseThrow();
        p.setUser(user);
        return repo.save(p);
    }

    //  UPDATE PRODUCT
    @PutMapping("/products/{id}")
    public Product update(@PathVariable Long id, @RequestBody Product p) {
        p.setId(id);
        return repo.save(p);
    }

    //  DELETE PRODUCT
    @DeleteMapping("/products/{id}")
    public void delete(@PathVariable Long id) {
        repo.deleteById(id);
    }
}