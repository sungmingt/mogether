package mogether.mogether.web.auth.filter.oauth2;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mogether.mogether.application.auth.AuthService;
import mogether.mogether.domain.oauth.AppUser;
import mogether.mogether.web.auth.dto.Token;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

import static mogether.mogether.domain.token.TokenInfo.ACCESS_TOKEN;
import static mogether.mogether.domain.token.TokenInfo.REFRESH_TOKEN;

@RequiredArgsConstructor
@Slf4j
@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {
    //OAuth2 인증 성공시 호출.
    //사용자 정보를 DB에 저장하고, 서비스 자체 액세스 토큰, 리프레시 토큰을 생성/저장

    private final AuthService authService;
    private static final String URI = "http://frontend.mo-gether.site/login/oauth/redirect";

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        log.info("====== OAuth2SuccessHandler 진입 ======");

        AppUser appUser = (AppUser) authentication.getPrincipal();
        Long userId = appUser.getId();

        Token token = authService.issueToken(userId);

        // 프론트로 redirect
        response.addHeader("userId", String.valueOf(userId));
        response.addHeader(ACCESS_TOKEN, token.getAccessToken());
        response.addHeader(REFRESH_TOKEN, token.getRefreshToken());
        response.sendRedirect(URI);
    }
}
