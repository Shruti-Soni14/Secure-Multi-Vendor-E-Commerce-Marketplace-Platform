package com.example.securemultivendorecommercemarketplaceplatform.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import com.example.securemultivendorecommercemarketplaceplatform.model.Cart;

public interface CartRepository extends JpaRepository<Cart, Long> {
    List<Cart> findByUserId(Long userId);
}