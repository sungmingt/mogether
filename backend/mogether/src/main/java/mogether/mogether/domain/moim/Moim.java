package mogether.mogether.domain.moim;

import lombok.Builder;
import lombok.Getter;
import mogether.mogether.domain.Address;
import mogether.mogether.domain.Keyword;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Getter
@Builder
public class Moim {

    private Long id;
    private Long userId;

    private String title;
    private String content;
    private List<String> imageUrls = new ArrayList<>();
    private Keyword keyword;
    private Address address;
    private String descrpition;
    //interests
    private Date createdAt;
    private Date expireAt;
}
