package mogether.mogether.application.bungae;

import com.amazonaws.AmazonServiceException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mogether.mogether.domain.bungae.Bungae;
import mogether.mogether.domain.bungae.BungaeImage;
import mogether.mogether.domain.bungae.BungaeImageRepository;
import mogether.mogether.exception.MogetherException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

import static mogether.mogether.exception.ErrorCode.FILE_CANNOT_SAVE;
import static mogether.mogether.exception.ErrorCode.FILE_DELETE_FAILED;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class BungaeImageService {

    private final AmazonS3 amazonS3;
    private final BungaeImageRepository bungaeImageRepository;

    @Value("${cloud.aws.s3.bucket}/bungae")
    private String bucket;

    @Value("${cloud.aws.s3.default_post}")
    private String defaultImageUrl;

    public void save(Bungae bungae, List<MultipartFile> multipartFiles) {
        for (MultipartFile multipartFile : multipartFiles) {
            if(multipartFile.isEmpty()){
                bungae.setImageUrls(List.of(defaultImageUrl));
                return;
            }

            BungaeImage bungaeImage = uploadToS3(multipartFile);
            bungaeImage.setBungae(bungae);
            bungae.getImageUrls().add(bungaeImage.getFileUrl());
            bungaeImageRepository.save(bungaeImage);
        }
    }

    public void update(Bungae findBungae, List<MultipartFile> multipartFiles) {
        Optional.ofNullable(findBungae.getBungaeImageList())
                .ifPresent(bungaeImage -> this.delete(findBungae, bungaeImage));
        save(findBungae, multipartFiles);
    }

    public BungaeImage uploadToS3(MultipartFile multipartFile) {
        String fileOriName = multipartFile.getOriginalFilename();
        String s3FileName = UUID.randomUUID() + "-" + fileOriName;

        try {
            ObjectMetadata objMeta = new ObjectMetadata();
            objMeta.setContentLength(multipartFile.getInputStream().available());
            amazonS3.putObject(bucket, s3FileName, multipartFile.getInputStream(), objMeta);
            log.info("### 파일 업로드 성공 = {}", s3FileName);
        } catch (IOException e) {
            throw new MogetherException(FILE_CANNOT_SAVE);
        }

        String s3Url = amazonS3.getUrl(bucket, s3FileName).toString();
        return new BungaeImage(fileOriName, s3Url, s3FileName);
    }

    @Transactional(readOnly = true)
    public List<String> getImageUrls(Bungae bungae) {
        //arraylist로 초기화 했으니 항상 null 이 아니다? -> count로 검증?
        return Optional.ofNullable(bungae.getBungaeImageList())
                        .orElse(List.of(new BungaeImage("mogether_default_post", defaultImageUrl, "mogether_default_post")))
                        .stream()
                        .map(BungaeImage::getFileUrl)
                        .toList();
    }

    public void delete(Bungae findBungae, List<BungaeImage> bungaeImageList) {
        for (BungaeImage bungaeImage : bungaeImageList) {
            deleteFromS3(bungaeImage.getS3FileName());
            bungaeImageRepository.delete(bungaeImage);
        }

        findBungae.getImageUrls().clear();
        findBungae.getBungaeImageList().clear();
    }

    public void deleteFromS3(String s3FileName) {
        try {
            amazonS3.deleteObject(this.bucket, s3FileName);
        } catch (AmazonServiceException e) {
            log.info("### 파일 삭제 실패 - {}", e.getErrorMessage());
            throw new MogetherException(FILE_DELETE_FAILED);
        }
    }
}