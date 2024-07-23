package mogether.mogether.web.bungae.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mogether.mogether.domain.Address;
import mogether.mogether.domain.Keyword;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BungaeCreateResponse {

    private Long id;
    private Long hostId;
    private List<String> imageUrls;

    private String title;
    private String content;
    private Keyword keyword; ////
    private Address address;
    private String description; //

    private String gatherAt;
    private LocalDate createdAt;
    private LocalDate expireAt;
}
