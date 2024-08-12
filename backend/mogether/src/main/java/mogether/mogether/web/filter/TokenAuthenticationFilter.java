package mogether.mogether.web.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import mogether.mogether.config.SecurityConfig;
import mogether.mogether.domain.oauth.AppUser;
import mogether.mogether.domain.token.TokenProvider;
import mogether.mogether.domain.token.redis.BlackListTokenRepository;
import mogether.mogether.domain.user.User;
import mogether.mogether.exception.MogetherException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.*;

import static mogether.mogether.domain.token.TokenInfo.*;
import static mogether.mogether.exception.ErrorCode.*;

@Slf4j
@Component
public class TokenAuthenticationFilter extends OncePerRequestFilter {

    private final BlackListTokenRepository blackListTokenRepository;
    private final TokenProvider tokenProvider;
    private final List<RequestMatcher> requestMatchers = new ArrayList<>();

    public TokenAuthenticationFilter(BlackListTokenRepository blackListTokenRepository, TokenProvider tokenProvider) {
        this.blackListTokenRepository = blackListTokenRepository;
        this.tokenProvider = tokenProvider;
        for (String uri : SecurityConfig.permittedURIs) {
            requestMatchers.add(new AntPathRequestMatcher(uri));
        }
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        log.info("===== token auth filter 진입 =====");

        if (isPermittedUri(request)) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String accessToken = getTokenfromRequest(request);

            if (blackListTokenRepository.isFromBlacklist(accessToken)) {
                throw new MogetherException(TOKEN_FROM_BLACKLIST);
            }

            tokenProvider.validateToken(accessToken);
            setAuthentication(accessToken);
            filterChain.doFilter(request, response);
        } catch (MogetherException e) {
            log.error(e.getMessage());
            sendErrorResponse(response, e);
        } catch (RuntimeException e) {
            log.error(e.getMessage());
            response.sendError(500, e.getMessage());
        }
    }

    private static void sendErrorResponse(HttpServletResponse response, MogetherException e) throws IOException {
        response.setStatus(e.getErrorCode().getStatus());
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("status", e.getErrorCode().getStatus());
        errorResponse.put("message", e.getMessage());

        String jsonResponse = objectMapper.writeValueAsString(errorResponse);
        try (PrintWriter writer = response.getWriter()) {
            writer.write(jsonResponse);
            writer.flush();
        }
    }

    private void setAuthentication(String accessToken) {
        Long userId = tokenProvider.getIdFromToken(accessToken);
        AppUser appUser = new AppUser(new User(userId), Map.of(), "attributeKey");

        Authentication authentication = new UsernamePasswordAuthenticationToken(appUser, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    protected boolean isPermittedUri(HttpServletRequest request) {
        for (RequestMatcher matcher : requestMatchers) {
            if (matcher.matches(request)) {
                return true;
            }
        }
        return false;
    }

    private String getTokenfromRequest(HttpServletRequest request) {
        return Optional.ofNullable(request.getHeader(ACCESS_TOKEN))
                .orElseThrow(() -> new MogetherException(REQUIRED_TOKEN_MISSING));
    }
}