package mogether.mogether.domain.info;

import mogether.mogether.exception.ErrorCode;
import mogether.mogether.exception.MogetherException;

import java.util.Arrays;

public enum GatherType {

    MOIM("모임"),
    BUNGAE("번개");

    private final String kor;

    GatherType(String kor) {
        this.kor = kor;
    }

    public String getKor() {
        return kor;
    }

    public static GatherType of(String input) {
        return Arrays.stream(values())
                .filter(gatherType -> gatherType.name().equals(input.toUpperCase()))
                .findFirst()
                .orElseThrow(() -> new MogetherException(ErrorCode.INVALID_GATHER_TYPE));
    }
}
