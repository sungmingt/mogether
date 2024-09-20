package mogether.mogether.application.bungae;

import lombok.RequiredArgsConstructor;
import mogether.mogether.application.user.UserService;
import mogether.mogether.application.chat.ChatRoomService;
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
import static mogether.mogether.exception.ErrorCode.*;
import static mogether.mogether.exception.ErrorCode.BUNGAE_NOT_FOUND;

@Transactional
@RequiredArgsConstructor
@Service
public class BungaeService {

    private final BungaeRepository bungaeRepository;
    private final BungaeUserRepository bungaeUserRepository;
    private final UserService userService;
    private final BungaeImageService bungaeImageService;
    private final ChatRoomService chatRoomService;

    public void join(Long bungaeId, AppUser appUser) {
        Bungae findBungae = findById(bungaeId);
        User findUser = userService.findById(appUser.getId());
        bungaeUserRepository.findByBungaeIdAndUserId(findBungae.getId(), findUser.getId())
                .ifPresentOrElse(
                        b -> {
                            throw new MogetherException(ALREADY_JOINED_BUNGAE);
                            },
                        () -> {
                            BungaeUser bungaeUser = new BungaeUser(findBungae, findUser);
                            bungaeUserRepository.save(bungaeUser);
                        });
        chatRoomService.joinBungaeChatRoom(findUser, findBungae);
    }

    public void quit(Long bungaeId, AppUser appUser) {
        Bungae findBungae = findById(bungaeId);
        chatRoomService.deleteJoinUser(findBungae.getChatRoom().getId(), appUser.getId());

        //bungaeUser 삭제
        BungaeUser bungaeUser = bungaeUserRepository.findByBungaeIdAndUserId(bungaeId, appUser.getId())
                .orElseThrow(() -> new MogetherException(NO_BUNGAEJOIN_HISTORY));
        bungaeUserRepository.delete(bungaeUser);
    }

    public void kickOut(AppUser appUser, BungaeKickOutRequest request) {
        Bungae findBungae = findById(request.getBungaeId());
        validateUser(findBungae.getHost().getId(), appUser.getId());

        //채팅방 퇴장
        chatRoomService.deleteJoinUser(findBungae.getChatRoom().getId(), request.getUserId());

        //bungaeUser 삭제
        BungaeUser bungaeUser = bungaeUserRepository.findByBungaeIdAndUserId(request.getBungaeId(), request.getUserId())
                .orElseThrow(() -> new MogetherException(NO_BUNGAEJOIN_HISTORY));
        bungaeUserRepository.delete(bungaeUser);
    }

    public BungaeCreateResponse create(AppUser appUser, List<MultipartFile> images, BungaeCreateRequest request) {
        User user = userService.findById(appUser.getId());
        Bungae bungae = request.toBungae(user);

        Bungae savedBungae = bungaeRepository.save(bungae);
        bungaeImageService.save(savedBungae, images);
        chatRoomService.createBungaeChatRoom(savedBungae);

        return BungaeCreateResponse.of(savedBungae);
    }

    public BungaeUpdateResponse update(Long bungaeId, AppUser appUser, BungaeUpdateRequest request, List<MultipartFile> images) {
        Bungae findBungae = findById(bungaeId);
        validateUser(findBungae.getHost().getId(), appUser.getId());

        findBungae.update(request.toBungae());
        bungaeImageService.update(findBungae, images);
        return BungaeUpdateResponse.of(findBungae);
    }

    public BungaeResponse read(Long bungaeId, AppUser appUser) {
        Bungae findBungae = findById(bungaeId);

        if (appUser != null) {
            User requestUser = userService.findById(appUser.getId());
            return BungaeResponse.of(findBungae, requestUser);
        } else {
            return BungaeResponse.ofAnonymous(findBungae);
        }
    }

    public List<BungaeListResponse> readAll(AppUser appUser) {
        List<Bungae> bungaeList = bungaeRepository.findAll(); //todo: 조회 전략 수정

        if (appUser != null) {
            User requestUser = userService.findById(appUser.getId());
            return BungaeListResponse.of(bungaeList, requestUser);
        } else {
            return BungaeListResponse.ofAnonymous(bungaeList);
        }
    }

    public List<BungaeListResponse> getHostingList(Long hostId, AppUser appUser) {
        List<Bungae> hostingList = bungaeRepository.findByHostId(hostId);

        if (appUser != null) {
            User requestUser = userService.findById(appUser.getId());
            return BungaeListResponse.of(hostingList, requestUser);
        } else {
            return BungaeListResponse.ofAnonymous(hostingList);
        }
    }

    public List<BungaeListResponse> searchByAddress(String name, String city, String gu, AppUser appUser) {
        List<Bungae> bungaeList = bungaeRepository.searchByAddress(name, city, gu);
        User requestUser = userService.findById(appUser.getId());
        return BungaeListResponse.of(bungaeList, requestUser);
    }

    public void delete(Long bungaeId, AppUser appUser) {
        Bungae findBungae = findById(bungaeId);
        validateUser(findBungae.getHost().getId(), appUser.getId());

        chatRoomService.deleteChatRoom(findBungae.getChatRoom().getId());
        bungaeRepository.deleteById(bungaeId);
    }

    @Transactional(readOnly = true)
    public Bungae findById(Long bungaeId) {
        return bungaeRepository.findById(bungaeId)
                .orElseThrow(() -> new MogetherException(BUNGAE_NOT_FOUND));
    }
}
