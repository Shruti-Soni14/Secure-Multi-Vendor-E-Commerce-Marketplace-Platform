package com.example.securemultivendorecommercemarketplaceplatform.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.securemultivendorecommercemarketplaceplatform.model.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

    //  Duplicate check
    boolean existsByName(String name);
}
