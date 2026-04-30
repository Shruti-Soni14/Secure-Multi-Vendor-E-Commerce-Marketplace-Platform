package com.example.securemultivendorecommercemarketplaceplatform.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/products")
@CrossOrigin(origins = "*")
public class ProductController {

    // GET all products (dummy)
    @GetMapping
    public String getProducts() {
        return "Products API working (demo mode)";
    }

    // ADD product (dummy)
    @PostMapping
    public String addProduct() {
        return "Product added (demo mode)";
    }

    // DELETE product (dummy)
    @DeleteMapping("/{id}")
    public String deleteProduct(@PathVariable Long id) {
        return "Product deleted (demo mode)";
    }
}
