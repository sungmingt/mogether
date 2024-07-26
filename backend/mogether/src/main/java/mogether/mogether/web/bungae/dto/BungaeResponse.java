package mogether.mogether.web.bungae.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mogether.mogether.domain.Address;
import mogether.mogether.domain.Keyword;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BungaeResponse {

    private Long id;
    private List<String> imageUrls;

    private Long hostId;
    private String hostName;
    private String hostProfileImageUrl;
    private String hostIntro;
    private List<String> participantsImageUrls;//
    private Long participantsCount;//
    private boolean isInterested;//todo

    private String title;
    private String content;
    private Keyword keyword; ////
    private Address address;
    private String description; //
    private Long interestsCount;

    private String gatherAt;
    private LocalDate createdAt;
    private LocalDate expireAt;
}
