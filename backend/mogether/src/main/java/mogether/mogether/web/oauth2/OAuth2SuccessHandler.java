package mogether.mogether.web.oauth2;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mogether.mogether.application.auth.AuthService;
import mogether.mogether.domain.oauth.AppUser;
import mogether.mogether.domain.user.User;
import mogether.mogether.web.auth.dto.Token;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@RequiredArgsConstructor
@Slf4j
@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

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
        User user = appUser.getUser();
        boolean signUp = user.getImageUrl() == null;

        String socialType = user.getSocialType().toString().toLowerCase();
        Token token = authService.issueToken(userId);

        response.sendRedirect(createRedirectURI(userId, signUp, socialType, token));
    }

    //todo: cookie로 수정
    private String createRedirectURI(Long userId, Boolean signUp, String socialType, Token token) {
        return baseURI + socialType
                + "?userId=" + userId
                + "&signUp=" + signUp
                + "&accessToken=" + token.getAccessToken()
                + "&refreshToken=" + token.getRefreshToken();
    }
}
