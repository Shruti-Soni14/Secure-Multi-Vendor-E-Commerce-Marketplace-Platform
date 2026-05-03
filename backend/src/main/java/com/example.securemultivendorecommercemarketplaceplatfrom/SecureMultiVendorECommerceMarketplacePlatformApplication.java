package com.example.securemultivendorecommercemarketplaceplatform;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
public class SecureMultiVendorECommerceMarketplacePlatformApplication {
    public static void main(String[] args) {
        SpringApplication.run(SecureMultiVendorECommerceMarketplacePlatformApplication.class, args);
    }
}
