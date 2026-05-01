package com.example.securemultivendorecommercemarketplaceplatform.controller;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    private List<Map<String, Object>> orders = new ArrayList<>();
    private List<Map<String, Object>> cart = new ArrayList<>();

    //  CHECKOUT
    @PostMapping("/checkout/{userId}")
    public List<Map<String, Object>> checkout(@PathVariable Long userId) {

        List<Map<String, Object>> userCart = new ArrayList<>();

        for (Map<String, Object> c : cart) {
            if (c.get("userId").equals(userId)) {
                userCart.add(c);
            }
        }

        for (Map<String, Object> c : userCart) {
            Map<String, Object> order = new HashMap<>();
            order.put("id", orders.size() + 1);
            order.put("userId", userId);
            order.put("productName", c.get("productName"));
            order.put("price", c.get("price"));

            orders.add(order);
        }

        cart.removeIf(c -> c.get("userId").equals(userId));

        return orders;
    }

    //  USER ORDERS
    @GetMapping("/{userId}")
    public List<Map<String, Object>> getOrders(@PathVariable Long userId) {

        List<Map<String, Object>> result = new ArrayList<>();

        for (Map<String, Object> o : orders) {
            if (o.get("userId").equals(userId)) {
                result.add(o);
            }
        }

        return result;
    }

    //  ADMIN
    @GetMapping("/all")
    public List<Map<String, Object>> getAllOrders() {
        return orders;
    }
}
