package mogether.mogether.web.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import mogether.mogether.domain.token.TokenProvider;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.*;

import static mogether.mogether.domain.token.TokenInfo.ACCESS_TOKEN;

@Slf4j
@Component
public class TokenExtractFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        log.info("===== Token Extractor Filter 진입 =====");
        HttpServletRequestWrapper requestWrapper = new HttpServletRequestWrapper(request) {
            private final Map<String, String> customHeaders = new HashMap<>();

            @Override
            public String getHeader(String name) {
                if (customHeaders.containsKey(name)) {
                    return customHeaders.get(name);
                }

                if (ACCESS_TOKEN.equalsIgnoreCase(name)) {
                    String modifiedToken = TokenProvider.replaceBearerToToken(super.getHeader(name));
                    if (modifiedToken != null) {
                        customHeaders.put(name, modifiedToken);
                        return modifiedToken;
                    }
                }

                return super.getHeader(name);
            }

            @Override
            public Enumeration<String> getHeaderNames() {
                List<String> headerNames = Collections.list(super.getHeaderNames());
                headerNames.addAll(customHeaders.keySet());
                return Collections.enumeration(headerNames);
            }

            @Override
            public Enumeration<String> getHeaders(String name) {
                if (customHeaders.containsKey(name)) {
                    return Collections.enumeration(Collections.singletonList(customHeaders.get(name)));
                }
                return super.getHeaders(name);
            }
        };

        filterChain.doFilter(requestWrapper, response);
    }
}