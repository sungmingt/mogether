package mogether.mogether.application.bungae;

import lombok.RequiredArgsConstructor;
import mogether.mogether.application.user.UserService;
import mogether.mogether.domain.bungae.Bungae;
import mogether.mogether.domain.bungae.BungaeRepository;
import mogether.mogether.domain.bungae.BungaeUser;
import mogether.mogether.domain.bungae.BungaeUserRepository;
import mogether.mogether.domain.user.User;
import mogether.mogether.exception.ErrorCode;
import mogether.mogether.exception.MogetherException;
import mogether.mogether.web.bungae.dto.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

import static mogether.mogether.exception.ErrorCode.BUNGAE_NOT_FOUND;

@Transactional
@RequiredArgsConstructor
@Service
public class BungaeService {

    private final BungaeRepository bungaeRepository;
    private final BungaeUserRepository bungaeUserRepository;
    private final UserService userService;
    private final BungaeImageService bungaeImageService;

    //유저의 번개 참여
    public void join(BungaeJoinRequest bungaeJoinRequest) {
        Long bungaeId = bungaeJoinRequest.getBungaeId();
        Long userId = bungaeJoinRequest.getUserId();

        Bungae findBungae = findById(bungaeId);
        User findUser = userService.findById(userId);

        BungaeUser bungaeUser = new BungaeUser(findBungae, findUser);
        bungaeUserRepository.save(bungaeUser);
    }

    //번개 참여 취소
    public void quit(BungaeQuitRequest bungaeQuitRequest) {
        //bungaeUser 삭제
        Long bungaeId = bungaeQuitRequest.getBungaeId();
        Long userId = bungaeQuitRequest.getUserId();

        BungaeUser bungaeUser = bungaeUserRepository.findByBungaeIdAndUserId(bungaeId, userId)
                .orElseThrow(() -> new MogetherException(ErrorCode.NO_BUNGAEJOIN_HISTORY));
        bungaeUserRepository.delete(bungaeUser);
    }

    //번개 글 작성
    public BungaeCreateResponse create(List<MultipartFile> images, BungaeCreateRequest bungaeCreateRequest) {
        Long userId = bungaeCreateRequest.getUserId();
        User user = userService.findById(userId);

        Bungae bungae = createBungae(bungaeCreateRequest, user);
        Bungae savedBungae = bungaeRepository.save(bungae);
        bungaeImageService.save(savedBungae, images);

        return BungaeCreateResponse.of(savedBungae);
    }

//    public BungaeResponse read(Long bungaeId) {
//        Bungae findBungae = findById(bungaeId);
//        return BungaeResponse.of(findBungae);
//    }


    @Transactional(readOnly = true)
    public Bungae findById(Long bungaeId) {
        return bungaeRepository.findById(bungaeId)
                .orElseThrow(() -> new MogetherException(BUNGAE_NOT_FOUND));
    }

    private static Bungae createBungae(BungaeCreateRequest bungaeCreateRequest, User user) {
        Bungae bungae = new Bungae(
                user,
                bungaeCreateRequest.getTitle(),
                bungaeCreateRequest.getContent(),
                bungaeCreateRequest.getKeyword(),
                bungaeCreateRequest.getAddress(),
                bungaeCreateRequest.getGatherAt(),
                bungaeCreateRequest.getCreatedAt(),
                bungaeCreateRequest.getExpireAt(),
                bungaeCreateRequest.getAddressDetails(),
                bungaeCreateRequest.getMinMember(),
                bungaeCreateRequest.getMaxMember(),
                bungaeCreateRequest.getAgeLimit(),
                bungaeCreateRequest.getFee()
                );
        bungae.setHost(user);
        return bungae;
    }


}
