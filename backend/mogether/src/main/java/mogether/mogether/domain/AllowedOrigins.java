package mogether.mogether.domain;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class AllowedOrigins {

    private AllowedOrigins() {}

    @Value("${cors.allowed-origins}")
    private String[] allowedOriginsInjected;
    public static String[] allowedOrigins;

    @PostConstruct
    private void init() {
        allowedOrigins = allowedOriginsInjected;  // Assign the injected value to the static field
    }
}
