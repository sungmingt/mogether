package mogether.mogether.web.oauth2;

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

@RequiredArgsConstructor
@Slf4j
@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {
    //OAuth2 인증 성공시 호출.
    //사용자 정보를 DB에 저장하고, 서비스 자체 액세스 토큰, 리프레시 토큰을 생성/저장

    private final AuthService authService;
//    private static final String baseURI = "https://dfrv032cq0wgz.cloudfront.net/login/social/";
    private static final String baseURI = "https://mo-gether.site/login/social/";

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        log.info("====== OAuth2SuccessHandler 진입 ======");

        AppUser appUser = (AppUser) authentication.getPrincipal();

        Long userId = appUser.getId();
        String socialType = appUser.getUser().getSocialType().toString().toLowerCase();
        Token token = authService.issueToken(userId);

        response.sendRedirect(createRedirectURI(userId, socialType, token));
    }

    private String createRedirectURI(Long userId, String socialType, Token token) {
        return baseURI + socialType
                + "?userId=" + userId
                + "&accessToken=" + token.getAccessToken()
                + "&refreshToken=" + token.getRefreshToken();
    }
}
