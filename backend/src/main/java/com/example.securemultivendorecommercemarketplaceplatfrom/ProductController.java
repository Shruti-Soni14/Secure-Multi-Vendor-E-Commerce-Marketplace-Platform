package com.example.securemultivendorecommercemarketplaceplatform.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import com.example.securemultivendorecommercemarketplaceplatform.model.Product;
import com.example.securemultivendorecommercemarketplaceplatform.repository.ProductRepository;

@RestController
@RequestMapping("/api/products")
@CrossOrigin("*")
public class ProductController {

    @Autowired
    private ProductRepository repo;

    //  GET ALL PRODUCTS
    @GetMapping
    public List<Product> getAll() {
        return repo.findAll();
    }

    //  ADD PRODUCT (WITH DUPLICATE CHECK)
    @PostMapping
    public Product add(@RequestBody Product p) {

        //  Duplicate check
        if (repo.existsByName(p.getName())) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Product already exists"
            );
        }

        // ✔ Save product
        return repo.save(p);
    }

    //  DELETE PRODUCT (optional - good for viva)
    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        repo.deleteById(id);
        return "Product deleted";
    }

    //  GET PRODUCT BY ID (optional)
    @GetMapping("/{id}")
    public Product getById(@PathVariable Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Product not found"));
    }
}
