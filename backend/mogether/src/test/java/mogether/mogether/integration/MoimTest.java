package mogether.mogether.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import mogether.mogether.application.chat.ChatRoomService;
import mogether.mogether.domain.moim.Moim;
import mogether.mogether.domain.moim.MoimRepository;
import mogether.mogether.domain.moim.MoimUser;
import mogether.mogether.domain.moim.MoimUserRepository;
import mogether.mogether.domain.info.Address;
import mogether.mogether.domain.token.TokenProvider;
import mogether.mogether.domain.user.User;
import mogether.mogether.domain.user.UserRepository;
import mogether.mogether.web.moim.dto.MoimUpdateRequest;
import mogether.mogether.web.moim.dto.MoimCreateRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpMethod;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.List;

import static java.nio.charset.StandardCharsets.*;
import static org.springframework.http.HttpMethod.*;
import static org.springframework.http.MediaType.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ActiveProfiles("test")
@AutoConfigureMockMvc
@SpringBootTest
class MoimTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private MoimRepository moimRepository;
    @Autowired
    private MoimUserRepository moimUserRepository;

    @Autowired
    private ChatRoomService chatRoomService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TokenProvider tokenProvider;

    @Autowired
    private ObjectMapper objectMapper;

    private String accessToken;
    private User user;
    private Moim moim;

    @BeforeEach
    void beforeEach() {
        user = userRepository.save(new User("kim", "minjae123@gmail.com", "Passw123@"));
        accessToken = tokenProvider.createAccessToken(user.getId());
        moim = moimRepository.save(new Moim(user, "title", "content", List.of("imageUrl"), new Address("seoul", "gangnam", "details")));
        chatRoomService.createMoimChatRoom(moim);
    }

    @DisplayName("모임 글 등록 요청에 성공적으로 응답을 반환한다")
    @Test
    void moimCreateTest() throws Exception {
        //given
        MoimCreateRequest requestDto = new MoimCreateRequest(user.getId(), "testTitle", "testContent", "PARTY", new Address(), LocalDate.now(), LocalDate.now());
        String content = objectMapper.writeValueAsString(requestDto);

        MockMultipartFile dtoPart = new MockMultipartFile(
                "dto",
                "",
                APPLICATION_JSON_VALUE,
                content.getBytes((UTF_8))
        );

        MockMultipartFile imagesPart = new MockMultipartFile(
                "images",
                "image.jpg",
                MULTIPART_FORM_DATA_VALUE,
                new byte[0]
        );

        //when
        ResultActions actions = mockMvc.perform(
                MockMvcRequestBuilders.multipart(POST, "/moim")
                        .file(imagesPart)
                        .file(dtoPart)
                        .accept(APPLICATION_JSON)
                        .contentType(MULTIPART_FORM_DATA)
                        .header("accessToken", accessToken));

        //then
        actions.andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value(requestDto.getTitle()))
                .andDo(print());
    }

    @DisplayName("모임 글 수정 요청에 성공적으로 응답을 반환한다")
    @Test
    void moimUpdateTest() throws Exception {
        //given
        MoimUpdateRequest requestDto = new MoimUpdateRequest(user.getId(), "testTitle", "testContent", "PARTY", new Address(), LocalDate.now(), LocalDate.now());
        String content = objectMapper.writeValueAsString(requestDto);

        MockMultipartFile dtoPart = new MockMultipartFile(
                "dto",
                "",
                APPLICATION_JSON_VALUE,
                content.getBytes((StandardCharsets.UTF_8))
        );

        MockMultipartFile imagesPart = new MockMultipartFile(
                "images",
                "image.jpg",
                MULTIPART_FORM_DATA_VALUE,
                new byte[0]
        );

        //when
        ResultActions actions = mockMvc.perform(
                multipart(HttpMethod.PATCH, "/moim/" + moim.getId())
                        .file(imagesPart)
                        .file(dtoPart)
                        .accept(APPLICATION_JSON)
                        .contentType(MULTIPART_FORM_DATA)
                        .header("accessToken", accessToken));

        //then
        actions.andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value(requestDto.getTitle()))
                .andDo(print());
    }

    @DisplayName("모임 글 상세조회 성공적으로 응답을 반환한다")
    @Test
    void moimReadTest() throws Exception {
        //given
        Long moimId = moim.getId();

        //when
        ResultActions actions = mockMvc.perform(
                get("/moim/" + moimId)
                        .accept(APPLICATION_JSON)
                        .header("accessToken", accessToken));

        //then
        actions.andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value(moim.getTitle()))
                .andExpect(jsonPath("$.content").value(moim.getContent()))
                .andDo(print());
    }

    @DisplayName("모임 글 리스트 조회 요청에 성공적으로 응답을 반환한다")
    @Test
    void moimReadAllTest() throws Exception {
        //when
        ResultActions actions = mockMvc.perform(
                get("/moim")
                        .accept(APPLICATION_JSON)
                        .header("accessToken", accessToken));

        //then
        actions.andExpect(status().isOk())
                .andDo(print());
    }

    @Transactional
    @DisplayName("모임 참여 요청에 성공적으로 응답을 반환한다")
    @Test
    void moimJoinTest() throws Exception {
        //given
        Long moimId = moim.getId();

        //when
        ResultActions actions = mockMvc.perform(
                post("/moim/" + moimId + "/join")
                        .header("accessToken", accessToken));

        //then
        actions.andExpect(status().isOk())
                .andDo(print());
    }

    @Transactional
    @DisplayName("모임 탈퇴 요청에 성공적으로 응답을 반환한다")
    @Test
    void moimQuitTest() throws Exception {
        //given
        Long moimId = moim.getId();
        moimUserRepository.save(new MoimUser(moim, user));
        chatRoomService.joinMoimChatRoom(user, moim);

        //when
        ResultActions actions = mockMvc.perform(
                delete("/moim/" + moimId + "/quit")
                        .header("accessToken", accessToken));

        //then
        actions.andExpect(status().isOk())
                .andDo(print());
    }
}