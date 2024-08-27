package mogether.mogether.web.auth;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mogether.mogether.application.auth.AuthService;
import mogether.mogether.web.auth.dto.LoginRequest;
import mogether.mogether.web.auth.dto.Token;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import static mogether.mogether.domain.token.TokenInfo.*;

@RequiredArgsConstructor
@Slf4j
@RestController
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public HttpStatus login(@RequestBody LoginRequest loginRequest, HttpServletResponse response) {
        Token token = authService.login(loginRequest);
        response.setHeader(ACCESS_TOKEN, token.getAccessToken());
        response.setHeader(REFRESH_TOKEN, token.getRefreshToken());
        response.setHeader(USER_ID, token.getRefreshToken());
        return HttpStatus.OK;
    }

    @PostMapping("/logout")
    public HttpStatus logout(@RequestHeader(ACCESS_TOKEN) String accessToken) {
        authService.logout(accessToken);
        return HttpStatus.NO_CONTENT;
    }

    @GetMapping("/token")
    public HttpStatus reissueToken(@RequestHeader String refreshToken, HttpServletResponse response) {
        Token token = authService.reissueToken(refreshToken);
        response.setHeader(ACCESS_TOKEN, token.getAccessToken());
        response.setHeader(REFRESH_TOKEN, token.getRefreshToken());
        return HttpStatus.OK;
    }
}
