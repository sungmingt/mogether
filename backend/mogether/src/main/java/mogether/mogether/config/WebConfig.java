package mogether.mogether.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@RequiredArgsConstructor
@Configuration
public class WebConfig implements WebMvcConfigurer {

    private static final String[] allowedOrigins = {
            "https://mo-gether.site",
            "http://mo-gether-front.s3-website.ap-northeast-2.amazonaws.com",
            "https://dfrv032cq0wgz.cloudfront.net"
    };

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowCredentials(true)
                .allowedOrigins(allowedOrigins)
                .allowedMethods("GET", "POST", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("userId", "accessToken", "refreshToken")
                .exposedHeaders("userId", "accessToken", "refreshToken")
                .maxAge(3600);
    }
}