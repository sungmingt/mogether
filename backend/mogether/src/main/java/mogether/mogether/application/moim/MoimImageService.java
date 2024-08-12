package mogether.mogether.application.moim;

import com.amazonaws.AmazonServiceException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mogether.mogether.domain.moim.Moim;
import mogether.mogether.domain.moim.MoimImage;
import mogether.mogether.domain.moim.MoimImageRepository;
import mogether.mogether.exception.MogetherException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static mogether.mogether.exception.ErrorCode.FILE_CANNOT_SAVE;
import static mogether.mogether.exception.ErrorCode.FILE_DELETE_FAILED;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class MoimImageService {

    private final AmazonS3 amazonS3;
    private final MoimImageRepository moimImageRepository;

    @Value("${cloud.aws.s3.bucket}/bungae")
    private String bucket;

    @Value("${cloud.aws.s3.default_post}")
    private String defaultImageUrl;

    public void save(Moim moim, List<MultipartFile> multipartFiles) {
        if (multipartFiles == null || multipartFiles.isEmpty()) {
            moim.setImageUrls(List.of(defaultImageUrl));
            return;
        }

        for (MultipartFile multipartFile : multipartFiles) {
            MoimImage moimImage = uploadToS3(multipartFile);
            moimImage.setMoim(moim);
            moim.getImageUrls().add(moimImage.getFileUrl());
            moimImageRepository.save(moimImage);
        }
    }

    public void update(Moim findMoim, List<MultipartFile> multipartFiles) {
        Optional.ofNullable(findMoim.getMoimImageList())
                .ifPresent(moimImage -> this.delete(findMoim, moimImage));
        save(findMoim, multipartFiles);
    }

    public MoimImage uploadToS3(MultipartFile multipartFile) {
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
        return new MoimImage(fileOriName, s3Url, s3FileName);
    }

    @Transactional(readOnly = true)
    public List<String> getImageUrls(Moim moim) {
        //arraylist로 초기화 했으니 항상 null 이 아니다? -> count로 검증?
        return Optional.ofNullable(moim.getMoimImageList())
                .orElse(List.of(new MoimImage("mogether_default_post", defaultImageUrl, "mogether_default_post")))
                .stream()
                .map(MoimImage::getFileUrl)
                .toList();
    }

    public void delete(Moim findMoim, List<MoimImage> moimImageList) {
        for (MoimImage moimImage : moimImageList) {
            deleteFromS3(moimImage.getS3FileName());
            moimImageRepository.delete(moimImage);
        }

        findMoim.getImageUrls().clear();
        findMoim.getMoimImageList().clear();
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