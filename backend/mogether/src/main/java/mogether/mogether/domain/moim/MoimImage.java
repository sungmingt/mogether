package mogether.mogether.domain.moim;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import static jakarta.persistence.FetchType.LAZY;
import static jakarta.persistence.GenerationType.IDENTITY;
import static lombok.AccessLevel.PROTECTED;

@Entity
@Getter
@NoArgsConstructor(access = PROTECTED)
public class MoimImage {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Long id;

    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "moim_id")
    private Moim moim;

    private String fileOriName;
    private String fileUrl;
    private String s3FileName;

    public MoimImage(String fileOriName, String fileUrl, String s3FileName) {
        this.fileOriName = fileOriName;
        this.fileUrl = fileUrl;
        this.s3FileName = s3FileName;
    }

    public void setMoim(Moim moim) {
        this.moim = moim;
        moim.getMoimImageList().add(this);
    }
}
