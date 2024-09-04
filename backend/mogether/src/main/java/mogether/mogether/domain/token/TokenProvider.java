package mogether.mogether.domain.token;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mogether.mogether.exception.MogetherException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Objects;

import static mogether.mogether.domain.token.TokenInfo.*;
import static mogether.mogether.exception.ErrorCode.*;

@Component
@RequiredArgsConstructor
@Slf4j
public class TokenProvider {

    @Value("${jwt.key}")
    private String key;
    private SecretKey secretKey;

    @PostConstruct
    private void setSecretKey() {
        secretKey = Keys.hmacShaKeyFor(key.getBytes());
    }

    public String createAccessToken(Long id) {
        return createToken(id, ACCESS_TOKEN_VALIDATION_SECOND);
    }

    public String createRefreshToken(Long id) {
        return createToken(id, REFRESH_TOKEN_VALIDATION_SECOND);
    }

    private String createToken(Long id, long timeToLive) {
        Date issueDate = new Date();
        Date expireDate = new Date(issueDate.getTime() + timeToLive);

        return  Jwts.builder()
                .claim(ID, id)
                .issuedAt(issueDate)
                .expiration(expireDate)
                .signWith(secretKey, Jwts.SIG.HS512)
                .compact();
    }

    public Long getIdFromToken(String token) {
        Claims claims = parseClaims(token);
        return Long.valueOf(String.valueOf(claims.get(ID))) ;
    }

    private Claims parseClaims(String token) {
        try {
            return Jwts.parser().verifyWith(secretKey).build()
                    .parseSignedClaims(token).getPayload();
        } catch (ExpiredJwtException e) {
            return e.getClaims();
        } catch (MalformedJwtException e) {
            throw new MogetherException(TOKEN_INVALID);
        } catch (SecurityException e) {
            throw new MogetherException(TOKEN_SIGNATURE_INVALID);
        }
    }

    public static String replaceBearerToToken(String bearerToken) {
        return bearerToken.replace(PREFIX, "");
    }

    public void validateToken(String token) {
        try {
            Objects.requireNonNull(token);
            Jwts.parser()
                    .verifyWith(secretKey).build()
                    .parseSignedClaims(token);
        } catch (ExpiredJwtException e) {
            throw new MogetherException(TOKEN_EXPIRED);
        } catch (NullPointerException | JwtException | IllegalArgumentException e) {
            throw new MogetherException(TOKEN_INVALID);
        }
    }

    public void checkRefreshTokenSameness(String inputRefreshToken, String exRefreshToken) {
        if (!inputRefreshToken.equals(exRefreshToken)) {
            throw new MogetherException(REFRESH_TOKEN_INVALID);
        }
    }

    public Long getTimeToLiveLeft(String accessToken) {
        Date expiration = parseClaims(accessToken).getExpiration();
        Date now = new Date();
        return expiration.getTime() - now.getTime();
    }

    private List<SimpleGrantedAuthority> getAuthorities(Claims claims) {
        return Collections.singletonList(new SimpleGrantedAuthority(
                claims.get("role").toString()));
    }

    //    public Authentication getAuthentication(String token) {
//        Claims claims = parseClaims(token);
//        String name = claims.get(NAME).toString();
//        List<SimpleGrantedAuthority> authorities = getAuthorities(claims);
//
//        // 2. security의 User 객체 생성
//        User principal = new User(name, "", authorities);
//        return new UsernamePasswordAuthenticationToken(principal, token, authorities);
//    }
}