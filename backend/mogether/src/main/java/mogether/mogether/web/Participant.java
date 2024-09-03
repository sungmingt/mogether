package mogether.mogether.web;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mogether.mogether.domain.user.User;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Participant {

    private Long userId;
    private String nickname;
    private String imageUrl;

    public static Participant toParticipant(User user) {
        return new Participant(user.getId(), user.getNickname(), user.getImageUrl());
    }
}
