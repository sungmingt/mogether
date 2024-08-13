package mogether.mogether.web.filter.token;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import mogether.mogether.domain.oauth.AppUser;
import mogether.mogether.domain.token.TokenProvider;
import mogether.mogether.domain.token.redis.BlackListTokenRepository;
import mogether.mogether.domain.user.User;
import mogether.mogether.exception.MogetherException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.*;

import static mogether.mogether.domain.token.TokenInfo.*;
import static mogether.mogether.exception.ErrorCode.*;
import static mogether.mogether.web.filter.ErrorResponseSender.sendErrorResponse;
import static mogether.mogether.web.filter.PathMatcher.isForAnonymousURI;
import static mogether.mogether.web.filter.PathMatcher.isPermittedURI;

@Slf4j
@Component
public class TokenAuthenticationFilter extends OncePerRequestFilter {

    private final BlackListTokenRepository blackListTokenRepository;
    private final TokenProvider tokenProvider;

    public TokenAuthenticationFilter(BlackListTokenRepository blackListTokenRepository, TokenProvider tokenProvider) {
        this.blackListTokenRepository = blackListTokenRepository;
        this.tokenProvider = tokenProvider;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        log.info("===== token auth filter 진입 =====");

        if (isPermittedURI(request) || (isForAnonymousURI(request) && !hasTokenHeader(request))) {
            filterChain.doFilter(request, response);
            return;
        }

        System.out.println("uri 통과 실패 ");

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

    private void setAuthentication(String accessToken) {
        Long userId = tokenProvider.getIdFromToken(accessToken);
        AppUser appUser = new AppUser(new User(userId), Map.of(), "attributeKey");

        Authentication authentication = new UsernamePasswordAuthenticationToken(appUser, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    private String getTokenfromRequest(HttpServletRequest request) {
        return Optional.ofNullable(request.getHeader(ACCESS_TOKEN))
                .orElseThrow(() -> new MogetherException(REQUIRED_TOKEN_MISSING));
    }
}