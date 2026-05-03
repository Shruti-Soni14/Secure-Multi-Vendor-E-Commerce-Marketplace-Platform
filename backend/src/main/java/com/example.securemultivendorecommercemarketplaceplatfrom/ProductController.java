package com.example.securemultivendorecommercemarketplaceplatform.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;

import com.example.securemultivendorecommercemarketplaceplatform.model.Product;
import com.example.securemultivendorecommercemarketplaceplatform.repository.ProductRepository;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductRepository repo;

    //  GET ALL PRODUCTS (DB से)
    @GetMapping
    public List<Product> getProducts() {
        return repo.findAll();
    }

    //  ADD PRODUCT (DB में save)
    @PostMapping
    public Product addProduct(@RequestBody Product product) {
        return repo.save(product);
    }
}
