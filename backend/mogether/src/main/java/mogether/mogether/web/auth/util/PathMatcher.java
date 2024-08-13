package mogether.mogether.web.auth.util;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class PathMatcher {

    private PathMatcher(){}

    private static final List<RequestMatcher> permittedURIMatcher = new ArrayList<>();
    private static final List<RequestMatcher> forAnonymousURIMatcher = new ArrayList<>();

    public static final String[] permittedURIs = {
            "/", "/auth/success", "/error", "/favicon.ico",
            "/api-docs/**", "/v3/api-docs/**", "/v3/api-docs/swagger-config/**",
            "/swagger-ui/**", "/swagger-ui.html", "/swagger-resources", "/swagger-resources/**",
            "/configuration/ui", "/configuration/security", "/webjars/**",
            "/h2-console/**",

            "/login/**", "/user/join", "/token", "/oauth2/**",
    };

    public static final String[] forAnonymousURIs = {
            "/moim", "/bungae", "/moim/*", "/bungae/*",
            "/user/*", "/user/*/host/bungae", "/user/*/host/moim"
    };

    //initialization
    static {
        for (String uri : permittedURIs) {
            permittedURIMatcher.add(new AntPathRequestMatcher(uri));
        }
        for (String uri : forAnonymousURIs) {
            forAnonymousURIMatcher.add(new AntPathRequestMatcher(uri));
        }
    }

    public static boolean isPermittedURI(HttpServletRequest request) {
        for (RequestMatcher matcher : permittedURIMatcher) {
            if (matcher.matches(request)) {
                return true;
            }
        }
        return false;
    }

    public static boolean isForAnonymousURI(HttpServletRequest request) {
        if (!Objects.equals(request.getMethod(), "GET")) {
            return false;
        }

        for (RequestMatcher matcher : forAnonymousURIMatcher) {
            System.out.println(matcher.toString());
            if (matcher.matches(request)) {
                return true;
            }
        }

        return false;
    }
}
