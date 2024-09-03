package mogether.mogether.application.bungae;

import lombok.RequiredArgsConstructor;
import mogether.mogether.application.user.UserService;
import mogether.mogether.domain.bungae.Bungae;
import mogether.mogether.domain.bungae.BungaeRepository;
import mogether.mogether.domain.bungae.BungaeUser;
import mogether.mogether.domain.bungae.BungaeUserRepository;
import mogether.mogether.domain.oauth.AppUser;
import mogether.mogether.domain.user.User;
import mogether.mogether.exception.ErrorCode;
import mogether.mogether.exception.MogetherException;
import mogether.mogether.web.bungae.dto.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

import static mogether.mogether.application.user.UserValidator.*;
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
    public void join(Long bungaeId, AppUser appUser) {
        Bungae findBungae = findById(bungaeId);
        User findUser = userService.findById(appUser.getId());
        BungaeUser bungaeUser = new BungaeUser(findBungae, findUser);
        bungaeUserRepository.save(bungaeUser);
    }

    //번개 참여 취소
    public void quit(Long bungaeId, AppUser appUser) {
        //bungaeUser 삭제
        BungaeUser bungaeUser = bungaeUserRepository.findByBungaeIdAndUserId(bungaeId, appUser.getId())
                .orElseThrow(() -> new MogetherException(ErrorCode.NO_BUNGAEJOIN_HISTORY));
        bungaeUserRepository.delete(bungaeUser);
    }

    //번개 추방 기능
    public void kickOut(AppUser appUser, BungaeKickOutRequest request) {
        Bungae findBungae = findById(request.getBungaeId());
        validateUser(findBungae.getHost().getId(), appUser.getId());

        //bungaeUser 삭제
        BungaeUser bungaeUser = bungaeUserRepository.findByBungaeIdAndUserId(request.getBungaeId(), request.getUserId())
                .orElseThrow(() -> new MogetherException(ErrorCode.NO_BUNGAEJOIN_HISTORY));
        bungaeUserRepository.delete(bungaeUser);
    }

    //번개 글 작성
    public BungaeCreateResponse create(AppUser appUser, List<MultipartFile> images, BungaeCreateRequest request) {
        User user = userService.findById(appUser.getId());
        Bungae bungae = request.toBungae(user);

        Bungae savedBungae = bungaeRepository.save(bungae);
        bungaeImageService.save(savedBungae, images);
        return BungaeCreateResponse.of(savedBungae);
    }

    //번개 글 수정
    public BungaeUpdateResponse update(Long bungaeId, AppUser appUser, BungaeUpdateRequest request, List<MultipartFile> images) {
        Bungae findBungae = findById(bungaeId);
        validateUser(findBungae.getHost().getId(), appUser.getId());

        findBungae.update(request.toBungae());
        bungaeImageService.update(findBungae, images);
        return BungaeUpdateResponse.of(findBungae);
    }

    //번개 상세 조회
    public BungaeResponse read(Long bungaeId, AppUser appUser) {
        Bungae findBungae = findById(bungaeId);

        if (appUser != null) {
            User requestUser = userService.findById(appUser.getId());
            return BungaeResponse.of(findBungae, requestUser);
        } else {
            return BungaeResponse.ofAnonymous(findBungae);
        }
    }

    //번개 리스트 조회
    public List<BungaeListResponse> readAll(AppUser appUser) {
        List<Bungae> bungaeList = bungaeRepository.findAll(); //todo: 조회 전략 수정

        if (appUser != null) {
            User requestUser = userService.findById(appUser.getId());
            return BungaeListResponse.of(bungaeList, requestUser);
        } else {
            return BungaeListResponse.ofAnonymous(bungaeList);
        }
    }

    //번개 hosting 리스트 조회
    public List<BungaeListResponse> getHostingList(Long hostId, AppUser appUser) {
        List<Bungae> hostingList = bungaeRepository.findByHostId(hostId);

        if (appUser != null) {
            User requestUser = userService.findById(appUser.getId());
            return BungaeListResponse.of(hostingList, requestUser);
        } else {
            return BungaeListResponse.ofAnonymous(hostingList);
        }
    }

    //검색
    public List<BungaeListResponse> searchByAddress(String name, String city, String gu, AppUser appUser) {
        List<Bungae> bungaeList = bungaeRepository.searchByAddress(name, city, gu);
        User requestUser = userService.findById(appUser.getId());
        return BungaeListResponse.of(bungaeList, requestUser);
    }

    //번개 글 삭제
    public void delete(Long bungaeId, AppUser appUser) {
        Bungae findBungae = findById(bungaeId);
        validateUser(findBungae.getHost().getId(), appUser.getId());
        bungaeRepository.deleteById(bungaeId);
    }

    @Transactional(readOnly = true)
    public Bungae findById(Long bungaeId) {
        return bungaeRepository.findById(bungaeId)
                .orElseThrow(() -> new MogetherException(BUNGAE_NOT_FOUND));
    }
}
