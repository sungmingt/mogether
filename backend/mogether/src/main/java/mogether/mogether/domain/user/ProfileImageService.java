package mogether.mogether.domain.user;

import com.amazonaws.AmazonServiceException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mogether.mogether.exception.MogetherException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

import static mogether.mogether.exception.ErrorCode.*;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class ProfileImageService {

    private final AmazonS3 amazonS3;
    private final ProfileImageRepository profileImageRepository;

    @Value("${cloud.aws.s3.bucket}/user")
    private String bucket;

    @Value("${cloud.aws.s3.default_user}")
    private String defaultImageUrl;

    public void save(User user, MultipartFile multipartFile) {
        if (multipartFile == null || multipartFile.isEmpty()) {
            user.setImageUrl(defaultImageUrl);
            return;
        }

        ProfileImage profileImage = uploadToS3(multipartFile);
        profileImage.setUser(user);
        user.setImageUrl(profileImage.getFileUrl());

        profileImageRepository.save(profileImage);
    }

    public void update(User findUser, MultipartFile multipartFile) {
        Optional.ofNullable(findUser.getProfileImage())
                .ifPresent(this::delete);
        save(findUser, multipartFile);
    }

    public ProfileImage uploadToS3(MultipartFile multipartFile) {
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
        return new ProfileImage(fileOriName, s3Url, s3FileName);
    }

    @Transactional(readOnly = true)
    public String getImageUrl(User user) {
        //arraylist로 초기화 했으니 항상 null 이 아니다? -> count로 검증?
        return Optional.ofNullable(user.getProfileImage())
                .map(ProfileImage::getFileUrl)
                .orElse(defaultImageUrl);
    }

    public void delete(ProfileImage profileImage) {
        deleteFromS3(profileImage.getS3FileName());
        profileImageRepository.delete(profileImage);
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