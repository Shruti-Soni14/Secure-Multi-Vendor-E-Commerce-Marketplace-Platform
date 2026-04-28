package com.example.securemultivendorecommercemarketplaceplatform.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.securemultivendorecommercemarketplaceplatform.model.Product;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {


    List<Product> findByUserId(Long userId);
    boolean existsByName(String name);
}