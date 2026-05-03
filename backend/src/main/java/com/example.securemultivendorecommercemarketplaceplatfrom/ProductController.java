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

    //  GET ALL PRODUCTS
    @GetMapping
    public List<Product> getAllProducts() {
        return repo.findAll();
    }

    //  ADD PRODUCT
    @PostMapping
    public Product addProduct(@RequestBody Product product) {
        return repo.save(product);
    }

    //  DELETE PRODUCT
    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id) {
        repo.deleteById(id);
    }

    //  UPDATE PRODUCT
    @PutMapping("/{id}")
    public Product updateProduct(@PathVariable Long id, @RequestBody Product newProduct) {

        Product p = repo.findById(id).orElseThrow();

        p.setName(newProduct.getName());
        p.setPrice(newProduct.getPrice());

        return repo.save(p);
    }
}
