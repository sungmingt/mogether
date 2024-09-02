package mogether.mogether.web.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PasswordFindResponse {

    private String password;

    public static PasswordFindResponse of(String temporaryPassword) {
        return new PasswordFindResponse(temporaryPassword);
    }
}
