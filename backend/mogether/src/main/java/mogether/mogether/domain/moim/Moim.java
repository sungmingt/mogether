package mogether.mogether.domain.moim;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import mogether.mogether.domain.chat.ChatRoom;
import mogether.mogether.domain.ImgaeUrlsConverter;
import mogether.mogether.domain.info.Address;
import mogether.mogether.domain.info.Keyword;
import mogether.mogether.domain.interest.moim.MoimInterest;
import mogether.mogether.domain.user.User;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import static jakarta.persistence.CascadeType.REMOVE;
import static jakarta.persistence.GenerationType.*;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
public class Moim {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Long id;

    @OneToMany(mappedBy = "moim", cascade = REMOVE)
    private List<MoimImage> moimImageList = new ArrayList<>();

    @OneToMany(mappedBy = "moim", cascade = REMOVE)
    private List<MoimUser> moimUserList = new ArrayList<>();

    @OneToMany(mappedBy = "moim", cascade = REMOVE)
    private List<MoimInterest> moimInterestList = new ArrayList<>();

    @OneToOne
    @JoinColumn(name = "chatroom_id")
    private ChatRoom chatRoom;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "host_id")
    private User host;

    private String title;
    private String content;

    @Convert(converter = ImgaeUrlsConverter.class)
    private List<String> imageUrls = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    private Keyword keyword;

    @Embedded
    private Address address;
    private LocalDate createdAt;
    private LocalDate expireAt;


    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls;
    }

    public void setHost(User user) {
        this.host = user;
        user.getMoimHostList().add(this);
    }

    public void setChatRoom(ChatRoom chatRoom) {
        this.chatRoom = chatRoom;
    }

    public void update(Moim newMoim){
        this.title = newMoim.getTitle();
        this.content = newMoim.getContent();
        this.keyword = newMoim.getKeyword();
        this.address = newMoim.getAddress();
        this.createdAt = newMoim.getCreatedAt();
        this.expireAt = newMoim.getExpireAt();
    }

    public Moim(String title, String content, Keyword keyword, Address address, LocalDate createdAt, LocalDate expireAt) {
        this.title = title;
        this.content = content;
        this.keyword = keyword;
        this.address = address;
        this.createdAt = createdAt;
        this.expireAt = expireAt;
    }

    public Moim(User host, String title, String content, List<String> imageUrls, Address address) {
        this.host = host;
        this.title = title;
        this.content = content;
        this.imageUrls = imageUrls;
        this.address = address;
    }
}
