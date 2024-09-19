package mogether.mogether.application.moim;

import lombok.RequiredArgsConstructor;
import mogether.mogether.application.user.UserService;
import mogether.mogether.application.chat.ChatRoomService;
import mogether.mogether.domain.moim.Moim;
import mogether.mogether.domain.moim.MoimRepository;
import mogether.mogether.domain.moim.MoimUser;
import mogether.mogether.domain.moim.MoimUserRepository;
import mogether.mogether.domain.oauth.AppUser;
import mogether.mogether.domain.user.User;
import mogether.mogether.exception.ErrorCode;
import mogether.mogether.exception.MogetherException;
import mogether.mogether.web.moim.dto.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

import static mogether.mogether.application.user.UserValidator.*;
import static mogether.mogether.exception.ErrorCode.MOIM_NOT_FOUND;

@Transactional
@RequiredArgsConstructor
@Service
public class MoimService {

    private final MoimRepository moimRepository;
    private final MoimUserRepository moimUserRepository;
    private final UserService userService;
    private final MoimImageService moimImageService;
    private final ChatRoomService chatRoomService;

    public void join(Long moimId, AppUser appUser) {
        Moim findMoim = findById(moimId);
        User findUser = userService.findById(appUser.getId());
        MoimUser moimUser = new MoimUser(findMoim, findUser);
        moimUserRepository.save(moimUser);
        chatRoomService.joinMoimChatRoom(findUser, findMoim);
    }

    public void quit(Long moimId, AppUser appUser) {
        Moim findMoim = findById(moimId);
        chatRoomService.deleteJoinUser(findMoim.getChatRoom().getId(), appUser.getId());

        //moimUser 삭제
        MoimUser moimUser = moimUserRepository.findByMoimIdAndUserId(moimId, appUser.getId())
                .orElseThrow(() -> new MogetherException(ErrorCode.NOT_MOIM_MEMBER));
        moimUserRepository.delete(moimUser);
    }

    public void kickOut(AppUser appUser, MoimKickOutRequest request) {
        Moim findMoim = findById(request.getMoimId());
        validateUser(findMoim.getHost().getId(), appUser.getId());

        //채팅방 퇴장
        chatRoomService.deleteJoinUser(findMoim.getChatRoom().getId(), request.getUserId());

        MoimUser moimUser = moimUserRepository.findByMoimIdAndUserId(request.getMoimId(), request.getUserId())
                .orElseThrow(() -> new MogetherException(ErrorCode.NOT_MOIM_MEMBER));
        moimUserRepository.delete(moimUser);
    }

    public MoimCreateResponse create(AppUser appUser, List<MultipartFile> images, MoimCreateRequest request) {
        User user = userService.findById(appUser.getId());
        Moim moim = request.toMoim(user);

        Moim savedMoim = moimRepository.save(moim);
        moimImageService.save(savedMoim, images);
        chatRoomService.createMoimChatRoom(savedMoim);

        return MoimCreateResponse.of(savedMoim);
    }

    public MoimUpdateResponse update(Long moimId, AppUser appUser, List<MultipartFile> images, MoimUpdateRequest request) {
        Moim findMoim = findById(moimId);
        validateUser(findMoim.getHost().getId(), appUser.getId());
        findMoim.update(request.toMoim());

        moimImageService.update(findMoim, images);
        return MoimUpdateResponse.of(findMoim);
    }

    //모임 상세 조회
    public MoimResponse read(Long moimId, AppUser appUser) {
        Moim findMoim = findById(moimId);

        if (appUser != null) {
            User requestUser = userService.findById(appUser.getId());
            return MoimResponse.of(findMoim, requestUser);
        } else {
            return MoimResponse.ofAnonymous(findMoim);
        }
    }

    public List<MoimListResponse> readAll(AppUser appUser) {
        List<Moim> moimList = moimRepository.findAll(); //todo: 조회 전략 수정

        if (appUser != null) {
            User requestUser = userService.findById(appUser.getId());
            return MoimListResponse.of(moimList, requestUser);
        } else {
            return MoimListResponse.ofAnonymous(moimList);
        }
    }

    public List<MoimListResponse> getHostingList(Long hostId, AppUser appUser) {
        List<Moim> hostingList = moimRepository.findByHostId(hostId);

        if (appUser != null) {
            User requestUser = userService.findById(appUser.getId());
            return MoimListResponse.of(hostingList, requestUser);
        } else {
            return MoimListResponse.ofAnonymous(hostingList);
        }
    }

    public List<MoimListResponse> searchByAddress(String name, String city, String gu, AppUser appUser) {
        List<Moim> moimList = moimRepository.searchByAddress(name, city, gu);
        User requestUser = userService.findById(appUser.getId());
        return MoimListResponse.of(moimList, requestUser);
    }

    public void delete(Long moimId, AppUser appUser) {
        Moim findMoim = findById(moimId);
        validateUser(findMoim.getHost().getId(), appUser.getId());

        chatRoomService.deleteChatRoom(findMoim.getChatRoom().getId());
        moimRepository.deleteById(moimId);
    }

    @Transactional(readOnly = true)
    public Moim findById(Long moimId) {
        return moimRepository.findById(moimId)
                .orElseThrow(() -> new MogetherException(MOIM_NOT_FOUND));
    }
}