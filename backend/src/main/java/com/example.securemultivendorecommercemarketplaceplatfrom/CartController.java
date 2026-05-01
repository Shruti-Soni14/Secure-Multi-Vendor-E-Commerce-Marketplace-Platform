package com.example.securemultivendorecommercemarketplaceplatform.controller;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {

    private List<Map<String, Object>> cart = new ArrayList<>();

    // ADD TO CART
    @PostMapping
    public Map<String, Object> addToCart(@RequestBody Map<String, Object> item) {

        item.put("id", cart.size() + 1);
        cart.add(item);

        return item;
    }

    //  GET USER CART
    @GetMapping("/{userId}")
    public List<Map<String, Object>> getCart(@PathVariable Long userId) {

        List<Map<String, Object>> result = new ArrayList<>();

        for (Map<String, Object> c : cart) {
            if (c.get("userId").equals(userId)) {
                result.add(c);
            }
        }

        return result;
    }

    //  DELETE ITEM
    @DeleteMapping("/{id}")
    public void removeFromCart(@PathVariable Long id) {

        cart.removeIf(c -> c.get("id").equals(id));
    }
}
