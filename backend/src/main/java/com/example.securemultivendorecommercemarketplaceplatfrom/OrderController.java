package com.example.securemultivendorecommercemarketplaceplatform.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/orders")
@CrossOrigin(origins = "*")
public class OrderController {

     @GetMapping
    public String test() {
        return "Orders API working";
    }

    // CHECKOUT (dummy)
    @PostMapping("/checkout/{userId}")
    public String checkout(@PathVariable Long userId) {
        return "Order placed successfully (demo mode)";
    }

    // USER: ORDER HISTORY (dummy)
    @GetMapping("/{userId}")
    public String getOrders(@PathVariable Long userId) {
        return "User orders (demo mode)";
    }

    // ADMIN: ALL ORDERS (dummy)
    @GetMapping("/all")
    public String getAllOrders() {
        return "All orders (demo mode)";
    }
}
