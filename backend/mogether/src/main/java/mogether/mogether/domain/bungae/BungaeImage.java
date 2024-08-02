package mogether.mogether.domain.bungae;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import static jakarta.persistence.FetchType.*;
import static jakarta.persistence.GenerationType.IDENTITY;
import static lombok.AccessLevel.PROTECTED;

@Entity
@Getter
@NoArgsConstructor(access = PROTECTED)
public class BungaeImage {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Long id;

    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "bungae_id")
    private Bungae bungae;

    private String fileOriName;
    private String fileUrl;
    private String s3FileName;

    public BungaeImage(String fileOriName, String fileUrl, String s3FileName) {
        this.fileOriName = fileOriName;
        this.fileUrl = fileUrl;
        this.s3FileName = s3FileName;
    }

    public void setBungae(Bungae bungae) {
        this.bungae = bungae;
        bungae.getBungaeImageList().add(this);
    }
}