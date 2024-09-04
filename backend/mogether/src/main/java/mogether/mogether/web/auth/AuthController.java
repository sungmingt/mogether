package mogether.mogether.web.auth;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mogether.mogether.application.auth.AuthService;
import mogether.mogether.web.auth.dto.LoginRequest;
import mogether.mogether.web.auth.dto.Token;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import static mogether.mogether.domain.token.TokenInfo.*;

@RequiredArgsConstructor
@Slf4j
@RestController
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public Token login(@RequestBody @Validated LoginRequest loginRequest) {
        return authService.login(loginRequest);
    }

    @PostMapping("/logout")
    public HttpStatus logout(@RequestHeader(ACCESS_TOKEN) String accessToken) {
        authService.logout(accessToken);
        return HttpStatus.NO_CONTENT;
    }

    @GetMapping("/token")
    public Token reissueToken(@RequestHeader String refreshToken) {
        return authService.reissueToken(refreshToken);
    }
}
