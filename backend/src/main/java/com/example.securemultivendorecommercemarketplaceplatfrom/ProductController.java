package com.example.securemultivendorecommercemarketplaceplatform.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;

import com.example.securemultivendorecommercemarketplaceplatform.model.Product;
import com.example.securemultivendorecommercemarketplaceplatform.repository.ProductRepository;

@RestController
@RequestMapping("/api/products")
@CrossOrigin("*")
public class ProductController {

    @Autowired
    private ProductRepository repo;

    @GetMapping
    public List<Product> getAll() {
        return repo.findAll();
    }

    @PostMapping
    public Product add(@RequestBody Product p) {
        return repo.save(p);
    }
}
