package com.example.securemultivendorecommercemarketplaceplatform;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(
    scanBasePackages = "com.example.securemultivendorecommercemarketplaceplatform",
    exclude = {
        org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration.class
    }
)
public class SecureMultiVendorECommerceMarketplacePlatformApplication {

    public static void main(String[] args) {
        SpringApplication.run(SecureMultiVendorECommerceMarketplacePlatformApplication.class, args);
    }
}

