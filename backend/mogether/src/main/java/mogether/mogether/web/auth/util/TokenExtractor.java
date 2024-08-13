package mogether.mogether.web.auth.util;

import jakarta.servlet.http.HttpServletRequest;
import mogether.mogether.exception.MogetherException;

import java.util.Optional;

import static mogether.mogether.domain.token.TokenInfo.ACCESS_TOKEN;
import static mogether.mogether.exception.ErrorCode.REQUIRED_TOKEN_MISSING;

public class TokenExtractor {

    private TokenExtractor(){}

    public static String getTokenfromRequest(HttpServletRequest request) {
        return Optional.ofNullable(request.getHeader(ACCESS_TOKEN))
                .orElseThrow(() -> new MogetherException(REQUIRED_TOKEN_MISSING));
    }

    public static boolean hasTokenHeader(HttpServletRequest request) {
        return Optional.ofNullable(request.getHeader(ACCESS_TOKEN))
                .isPresent();
    }
}
