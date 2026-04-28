package com.example.securemultivendorecommercemarketplaceplatform.controller;

import org.springframework.web.bind.annotation.*;
        import java.util.List;

import com.example.securemultivendorecommercemarketplaceplatform.model.Order;
import com.example.securemultivendorecommercemarketplaceplatform.model.Cart;
import com.example.securemultivendorecommercemarketplaceplatform.repository.OrderRepository;
import com.example.securemultivendorecommercemarketplaceplatform.repository.CartRepository;

@RestController
@RequestMapping("/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {

    private final OrderRepository orderRepo;
    private final CartRepository cartRepo;

    public OrderController(OrderRepository orderRepo, CartRepository cartRepo) {
        this.orderRepo = orderRepo;
        this.cartRepo = cartRepo;
    }

    //  CHECKOUT (cart → orders)
    @PostMapping("/checkout/{userId}")
    public String checkout(@PathVariable Long userId) {
        List<Cart> cartItems = cartRepo.findByUserId(userId);

        for (Cart c : cartItems) {
            Order o = new Order();
            o.setUserId(userId);
            o.setProductName(c.getProductName());
            o.setPrice(c.getPrice());
            orderRepo.save(o);
        }

        cartRepo.deleteAll(cartItems);

        return "Order placed successfully";
    }

    //  USER: ORDER HISTORY
    @GetMapping("/{userId}")
    public List<Order> getOrders(@PathVariable Long userId) {
        return orderRepo.findByUserId(userId);
    }

    //  ADMIN: ALL ORDERS
    @GetMapping("/all")
    public List<Order> getAllOrders() {
        return orderRepo.findAll();
    }
}