package mogether.mogether.web.chat;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import mogether.mogether.domain.oauth.AppUser;
import mogether.mogether.domain.token.TokenProvider;
import mogether.mogether.domain.token.redis.BlackListTokenRepository;
import mogether.mogether.exception.MogetherException;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.List;
import java.util.Map;

import static mogether.mogether.exception.ErrorCode.TOKEN_FROM_BLACKLIST;
import static mogether.mogether.web.auth.util.ErrorResponseSender.sendErrorResponse;
import static mogether.mogether.web.auth.util.TokenExtractor.getTokenfromRequest;

@Slf4j
@Component
public class WebSocketHandshakeInterceptor implements HandshakeInterceptor {

    private final BlackListTokenRepository blackListTokenRepository;
    private final TokenProvider tokenProvider;

    public WebSocketHandshakeInterceptor(BlackListTokenRepository blackListTokenRepository, TokenProvider tokenProvider) {
        this.blackListTokenRepository = blackListTokenRepository;
        this.tokenProvider = tokenProvider;
    }

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
                                   WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {

        log.info("### {}", "websocket handshake 발생");
//        HttpServletResponse httpServletResponse = (HttpServletResponse) response;
//
//        try {
//            String accessToken = getTokenfromRequest((HttpServletRequest) request);
//            validateRequestToken(accessToken);
//
//            setAuthentication(accessToken);
//        } catch (MogetherException e) {
//            log.error("### {}", e.getMessage());
//            sendErrorResponse(httpServletResponse, e);
//        } catch (RuntimeException e) {
//            log.error("### {}", e.getMessage());
//            httpServletResponse.sendError(500, e.getMessage());
//        }

        return true;
    }

    private void setAuthentication(String accessToken) {
        Long userId = tokenProvider.getIdFromToken(accessToken);
        AppUser appUser = new AppUser(userId);

        Authentication authentication = new UsernamePasswordAuthenticationToken(appUser, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    private void validateRequestToken(String token) {
        if (blackListTokenRepository.isFromBlacklist(token)) {
            throw new MogetherException(TOKEN_FROM_BLACKLIST);
        }

        tokenProvider.validateToken(token);
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Exception exception) {
    }
}