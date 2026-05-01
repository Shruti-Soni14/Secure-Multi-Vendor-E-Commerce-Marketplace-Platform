package com.example.securemultivendorecommercemarketplaceplatform.controller;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    private List<Map<String, Object>> products = new ArrayList<>();

    public ProductController() {
        Map<String, Object> p1 = new HashMap<>();
        p1.put("id", 1);
        p1.put("name", "Laptop");
        p1.put("price", 50000);

        Map<String, Object> p2 = new HashMap<>();
        p2.put("id", 2);
        p2.put("name", "Mobile");
        p2.put("price", 20000);

        products.add(p1);
        products.add(p2);
    }

    @GetMapping
    public List<Map<String, Object>> getProducts() {
        return products;
    }
}
