package mogether.mogether.application.user;

import mogether.mogether.exception.MogetherException;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Objects;
import java.util.regex.Pattern;

import static mogether.mogether.exception.ErrorCode.*;
import static mogether.mogether.exception.ErrorCode.PASSWORD_NOT_VALID;
import static mogether.mogether.exception.ErrorCode.USER_NOT_AUTHORIZED;

public class UserValidator {

    public static final String REG_EMAIL = "\\w+@\\w+\\.\\w+(\\.\\w+)?";
    //최소 8글자, 대소문자, 특수문자 필수 포함
    public static final String REG_PASSWORD = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[@!%*#?&])[A-Za-z\\d@!%*#?&]{8,}$";
    public static final String ALGORITHM = "SHA-512";

    private UserValidator() {
    }

    public static void checkPasswordPattern(String password) {
        if (!Pattern.matches(REG_PASSWORD, password)) {
            throw new MogetherException(PASSWORD_NOT_VALID);
        }
    }

    public static void checkUserAuthority(Long requestUserId, Long userId) {
        if(!Objects.equals(requestUserId, userId)) {
            throw new MogetherException(USER_NOT_AUTHORIZED);
        }
    }

    public static String encodePassword(String password) {  // todo : salt 적용 (salt 컬럼 추가)
        try {
            MessageDigest md = MessageDigest.getInstance(ALGORITHM);
            md.update(password.getBytes());
            return String.format("%0128x", new BigInteger(1, md.digest()));
        } catch (NoSuchAlgorithmException e) {
            throw new MogetherException(NO_SUCH_ALGORITHM);
        }
    }

    public static boolean isOwner(Long id, Long reuqestId) {
        return Objects.equals(id, reuqestId);
    }

    public static void validateUser(Long id, Long requestId) {
        if (!isOwner(id, requestId)) {
            throw new MogetherException(NOT_RESOURCE_OWNER);
        }
    }
}