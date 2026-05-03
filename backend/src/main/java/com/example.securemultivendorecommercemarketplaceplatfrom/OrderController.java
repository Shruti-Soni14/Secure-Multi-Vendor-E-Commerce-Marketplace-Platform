package com.example.securemultivendorecommercemarketplaceplatform.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import com.example.securemultivendorecommercemarketplaceplatform.model.Order;
import com.example.securemultivendorecommercemarketplaceplatform.repository.OrderRepository;

import java.util.*;

import static com.example.securemultivendorecommercemarketplaceplatform.controller.CartController.cart;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderRepository orderRepo;

    //  CHECKOUT (DB SAVE)
    @PostMapping("/checkout/{userId}")
    public List<Order> checkout(@PathVariable Long userId) {

        List<Order> savedOrders = new ArrayList<>();

        for (Map<String, Object> c : cart) {

            if (Long.valueOf(c.get("userId").toString()).equals(userId)) {

                Order order = new Order();
                order.setUserId(userId);
                order.setProductName(c.get("productName").toString());
                order.setPrice(Double.valueOf(c.get("price").toString()));

                savedOrders.add(orderRepo.save(order)); //  MAIN FIX
            }
        }

        // cart clear
        cart.removeIf(c -> Long.valueOf(c.get("userId").toString()).equals(userId));

        return savedOrders;
    }

    //  USER ORDERS (DB FETCH)
    @GetMapping("/{userId}")
    public List<Order> getOrders(@PathVariable Long userId) {
        return orderRepo.findByUserId(userId);
    }

    //  ADMIN
    @GetMapping("/all")
    public List<Order> getAllOrders() {
        return orderRepo.findAll();
    }
}
