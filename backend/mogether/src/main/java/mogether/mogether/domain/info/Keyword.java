package mogether.mogether.domain.info;

import java.util.Arrays;

public enum Keyword {

    TRAVEL, DRINKING, FOOD, SPORTS, ACTIVITY, GAME,
    PARTY, CULTURE, STUDY, LANGUAGE, HOBBY, UNSELECTED;

    public static Keyword of(String input) {
        return Arrays.stream(values())
                .filter(gender -> gender.name().equals(input.toUpperCase()))
                .findFirst()
                .orElse(UNSELECTED);
    }
}
