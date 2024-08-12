package mogether.mogether.domain.info;

import java.util.Arrays;

public enum Gender {

    MALE, FEMALE, UNSELECTED;

    public static Gender of(String input) {
        return Arrays.stream(values())
                .filter(gender -> gender.name().equals(input.toUpperCase()))
                .findFirst()
                .orElse(UNSELECTED);
    }
}
