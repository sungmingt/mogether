package mogether.mogether.domain.redis;


public class TokenInfo {

    private TokenInfo(){}

    public static final String ACCESS_TOKEN = "accessToken";
    public static final String REFRESH_TOKEN = "refreshToken";

    public static final long ACCESS_TOKEN_VALIDATION_SECOND = 1000 * 60 * 30L;
    public static final long REFRESH_TOKEN_VALIDATION_SECOND = 1000 * 60 * 60L * 24 * 3;
    public static final String NAME = "name";
    public static final String PREFIX = "Bearer ";
}
