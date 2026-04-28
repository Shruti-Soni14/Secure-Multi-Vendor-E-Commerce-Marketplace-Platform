package com.example.securemultivendorecommercemarketplaceplatform.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import com.example.securemultivendorecommercemarketplaceplatform.model.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserId(Long userId);
}