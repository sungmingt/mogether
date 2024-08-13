package mogether.mogether.domain.user.image;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import lombok.Getter;
import lombok.NoArgsConstructor;
import mogether.mogether.domain.user.User;

import static jakarta.persistence.GenerationType.IDENTITY;
import static lombok.AccessLevel.PROTECTED;

@Entity
@Getter
@NoArgsConstructor(access = PROTECTED)
public class ProfileImage {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Long id;

    @OneToOne(mappedBy = "profileImage")
    private User user;

    private String fileOriName;
    private String fileUrl;
    private String s3FileName;

    public ProfileImage(String fileOriName, String fileUrl, String s3FileName) {
        this.fileOriName = fileOriName;
        this.fileUrl = fileUrl;
        this.s3FileName = s3FileName;
    }

    public void setUser(User user) {
        this.user = user;
        user.setProfileImage(this);
        user.setImageUrl(this.getFileUrl());
    }
}