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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@RequiredArgsConstructor
@Slf4j
@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    @Value("${front.origin}")
    private String frontOrigin;

    private final AuthService authService;
    private static final String LOGIN_ENDPOINT = "/social/login/";
    private static final String REGISTER_ENDPOINT = "/social/register";

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        log.info("====== OAuth2SuccessHandler 진입 ======");

        AppUser appUser = (AppUser) authentication.getPrincipal();
        User user = appUser.getUser();

        String socialType = user.getSocialType().toString().toLowerCase();
        Long userId = user.getId();
        Token token = authService.issueToken(userId);

        if (isRegister(user)) {
            response.sendRedirect(createRegisterRedirectURI(userId, token));
        }else {
            response.sendRedirect(createLoginRedirectURI(socialType, userId, token));
        }
    }

    private String createLoginRedirectURI(String socialType, Long userId, Token token) {
        return frontOrigin + LOGIN_ENDPOINT + socialType
                + "?userId=" + userId
                + "&accessToken=" + token.getAccessToken()
                + "&refreshToken=" + token.getRefreshToken();
    }

    //todo: cookie로 수정
    private String createRegisterRedirectURI(Long userId, Token token) {
        return frontOrigin + REGISTER_ENDPOINT
                + "?userId=" + userId
                + "&accessToken=" + token.getAccessToken()
                + "&refreshToken=" + token.getRefreshToken();
    }

    private boolean isRegister(User user) {
        return user.getImageUrl() == null;
    }
}
