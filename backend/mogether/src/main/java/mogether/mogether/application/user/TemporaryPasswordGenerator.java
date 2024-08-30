package mogether.mogether.application.user;
import org.springframework.stereotype.Service;
import java.security.SecureRandom;

@Service
public class TemporaryPasswordGenerator {

    private TemporaryPasswordGenerator(){}

    private static final String ALPHANUMERIC = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    private static final SecureRandom secureRandom = new SecureRandom();

    public static String generateTemporaryPassword() {
        StringBuilder sb = new StringBuilder(8);
        for (int i = 0; i < 8; i++) {
            sb.append(ALPHANUMERIC.charAt(secureRandom.nextInt(ALPHANUMERIC.length())));
        }
        return sb.toString();
    }
}