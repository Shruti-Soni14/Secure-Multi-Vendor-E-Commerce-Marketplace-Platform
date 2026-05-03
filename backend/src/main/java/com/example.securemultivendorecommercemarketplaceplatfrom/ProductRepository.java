package com.example.securemultivendorecommercemarketplaceplatform.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.securemultivendorecommercemarketplaceplatform.model.Product;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    //  correct relation query
    List<Product> findByUser_Id(Long userId);

    //  check duplicate product name
    boolean existsByName(String name);
}
