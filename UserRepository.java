package com.example.securemultivendorecommercemarketplaceplatform.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.securemultivendorecommercemarketplaceplatform.model.User;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByUsername(String username);
}