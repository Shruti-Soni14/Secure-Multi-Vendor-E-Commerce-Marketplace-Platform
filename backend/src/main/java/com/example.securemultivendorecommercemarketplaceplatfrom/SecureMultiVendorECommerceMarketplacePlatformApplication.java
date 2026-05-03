package com.example.securemultivendorecommercemarketplaceplatform;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.example.securemultivendorecommercemarketplaceplatform.repository")
@EntityScan(basePackages = "com.example.securemultivendorecommercemarketplaceplatform.model")
public class SecureMultiVendorECommerceMarketplacePlatformApplication {

    public static void main(String[] args) {
        SpringApplication.run(SecureMultiVendorECommerceMarketplacePlatformApplication.class, args);
    }
}
