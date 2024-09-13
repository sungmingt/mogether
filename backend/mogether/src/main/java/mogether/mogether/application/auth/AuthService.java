package mogether.mogether.application.auth;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mogether.mogether.domain.token.TokenProvider;
import mogether.mogether.domain.token.redis.BlackListTokenRepository;
import mogether.mogether.domain.token.redis.RefreshTokenRepository;
import mogether.mogether.domain.user.User;
import mogether.mogether.domain.user.UserRepository;
import mogether.mogether.application.user.UserValidator;
import mogether.mogether.exception.MogetherException;
import mogether.mogether.web.auth.dto.LoginRequest;
import mogether.mogether.web.auth.dto.Token;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static mogether.mogether.exception.ErrorCode.*;
import static mogether.mogether.exception.ErrorCode.EMAIL_NOT_EXISTS;
import static mogether.mogether.exception.ErrorCode.PASSWORD_NOT_MATCH;

@Transactional
@RequiredArgsConstructor
@Slf4j
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final TokenProvider tokenProvider;
    private final RefreshTokenRepository refreshTokenRepository;
    private final BlackListTokenRepository blackListTokenRepository;

    public Token login(LoginRequest loginRequest) {
        User user = findByEmail(loginRequest.getEmail());
        checkPassword(loginRequest.getPassword(), user.getPassword());
        return issueToken(user.getId());
    }

    public void logout(String accessToken) {
        //refresh token 삭제
        Long userId = tokenProvider.getIdFromToken(accessToken);
        refreshTokenRepository.deleteById(userId);

        //blacklist 등록
        Long timeToLiveLeft = tokenProvider.getTimeToLiveLeft(accessToken);
        blackListTokenRepository.setBlackList(accessToken, timeToLiveLeft);
    }

    public Token reissueToken(String refreshToken) {
        Long userId = tokenProvider.getIdFromToken(refreshToken);

        //refresh token 검증
        tokenProvider.validateToken(refreshToken);
        validateStoredRefreshToken(refreshToken, userId);

        //reissue token
        return issueToken(userId);
    }

    public Token issueToken(Long userId) {
        String accessToken = tokenProvider.createAccessToken(userId);
        String refreshToken = tokenProvider.createRefreshToken(userId);
        refreshTokenRepository.save(userId, refreshToken);
        return new Token(accessToken, refreshToken, userId);
    }

    private void validateStoredRefreshToken(String refreshToken, Long userId) {
        String storedRefreshToken = refreshTokenRepository.findById(userId)
                .orElseThrow(() -> new MogetherException(REFRESH_TOKEN_INVALID));
        tokenProvider.checkRefreshTokenSameness(refreshToken, storedRefreshToken);
    }

    private void checkPassword(String input, String exact) {
        String expected = UserValidator.encodePassword(input);
        if(!expected.equals(exact)){
            throw new MogetherException(PASSWORD_NOT_MATCH);
        }
    }

    private User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new MogetherException(EMAIL_NOT_EXISTS));
    }
}
