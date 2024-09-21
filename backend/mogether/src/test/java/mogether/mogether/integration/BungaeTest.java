package mogether.mogether.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import mogether.mogether.application.chat.ChatRoomService;
import mogether.mogether.domain.bungae.Bungae;
import mogether.mogether.domain.bungae.BungaeRepository;
import mogether.mogether.domain.bungae.BungaeUser;
import mogether.mogether.domain.bungae.BungaeUserRepository;
import mogether.mogether.domain.info.Address;
import mogether.mogether.domain.token.TokenProvider;
import mogether.mogether.domain.user.User;
import mogether.mogether.domain.user.UserRepository;
import mogether.mogether.web.bungae.dto.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ActiveProfiles("test")
@AutoConfigureMockMvc
@SpringBootTest
class BungaeTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private BungaeRepository bungaeRepository;

    @Autowired
    private BungaeUserRepository bungaeUserRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TokenProvider tokenProvider;

    @Autowired
    private ChatRoomService chatRoomService;

    @Autowired
    private ObjectMapper objectMapper;

    private String accessToken;
    private User user;
    private Bungae bungae;

    @BeforeEach
    void beforeEach() {
        user = userRepository.save(new User("kim", "minjae123@gmail.com", "Passw123@"));
        accessToken = tokenProvider.createAccessToken(user.getId());
        bungae = bungaeRepository.save(new Bungae(user, "title", "content", List.of("imageUrl"), new Address("seoul", "gangnam", "details")));
        chatRoomService.createBungaeChatRoom(bungae);
    }

    @DisplayName("번개 글 등록 요청에 성공적으로 응답을 반환한다")
    @Test
    void bungaeCreateTest() throws Exception {
        //given
        BungaeCreateRequest requestDto = new BungaeCreateRequest(user.getId(), "testTitle", "testContent", "PARTY");
        String content = objectMapper.writeValueAsString(requestDto);

        MockMultipartFile dtoPart = new MockMultipartFile(
                "dto",
                "",
                MediaType.APPLICATION_JSON_VALUE,
                content.getBytes((StandardCharsets.UTF_8))
        );

        MockMultipartFile imagesPart = new MockMultipartFile(
                "images",
                "image.jpg",
                MediaType.MULTIPART_FORM_DATA_VALUE,
                new byte[0]
        );

        //when
        ResultActions actions = mockMvc.perform(
                MockMvcRequestBuilders.multipart(HttpMethod.POST, "/bungae")
                        .file(imagesPart)
                        .file(dtoPart)
                        .accept(MediaType.APPLICATION_JSON)
                        .contentType(MediaType.MULTIPART_FORM_DATA)
                        .header("accessToken", accessToken));

        //then
        actions.andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value(requestDto.getTitle()))
                .andDo(print());
    }

    @DisplayName("번개 글 수정 요청에 성공적으로 응답을 반환한다")
    @Test
    void bungaeUpdateTest() throws Exception {
        //given
        BungaeUpdateRequest requestDto = new BungaeUpdateRequest(user.getId(), "testTitle", "testContent", "PARTY");
        String content = objectMapper.writeValueAsString(requestDto);

        MockMultipartFile dtoPart = new MockMultipartFile(
                "dto",
                "",
                MediaType.APPLICATION_JSON_VALUE,
                content.getBytes((StandardCharsets.UTF_8))
        );

        MockMultipartFile imagesPart = new MockMultipartFile(
                "images",
                "image.jpg",
                MediaType.MULTIPART_FORM_DATA_VALUE,
                new byte[0]
        );

        //when
        ResultActions actions = mockMvc.perform(
                multipart(HttpMethod.PATCH, "/bungae/" + bungae.getId())
                        .file(imagesPart)
                        .file(dtoPart)
                        .accept(MediaType.APPLICATION_JSON)
                        .contentType(MediaType.MULTIPART_FORM_DATA)
                        .header("accessToken", accessToken));

        //then
        actions.andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value(requestDto.getTitle()))
                .andDo(print());
    }

    @DisplayName("번개 글 상세조회 성공적으로 응답을 반환한다")
    @Test
    void bungaeReadTest() throws Exception {
        //given
        Long bungaeId = bungae.getId();

        //when
        ResultActions actions = mockMvc.perform(
                get("/bungae/" + bungaeId)
                        .accept(MediaType.APPLICATION_JSON)
                        .header("accessToken", accessToken));

        //then
        actions.andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value(bungae.getTitle()))
                .andExpect(jsonPath("$.content").value(bungae.getContent()))
                .andDo(print());
    }

    @DisplayName("번개 글 리스트 조회 요청에 성공적으로 응답을 반환한다")
    @Test
    void bungaeReadAllTest() throws Exception {
        //when
        ResultActions actions = mockMvc.perform(
                get("/bungae")
                        .accept(MediaType.APPLICATION_JSON)
                        .header("accessToken", accessToken));

        //then
        actions.andExpect(status().isOk())
                .andDo(print());
    }

    @Transactional
    @DisplayName("번개 참여 요청에 성공적으로 응답을 반환한다")
    @Test
    void bungaeJoinTest() throws Exception {
        //given
        Long bungaeId = bungae.getId();

        //when
        ResultActions actions = mockMvc.perform(
                post("/bungae/" + bungaeId + "/join")
                        .header("accessToken", accessToken));

        //then
        actions.andExpect(status().isOk())
                .andDo(print());
    }

    @Transactional
    @DisplayName("번개 탈퇴 요청에 성공적으로 응답을 반환한다")
    @Test
    void bungaeQuitTest() throws Exception {
        //given
        Long bungaeId = bungae.getId();
        bungaeUserRepository.save(new BungaeUser(bungae, user));
        chatRoomService.joinBungaeChatRoom(user, bungae);

        //when
        ResultActions actions = mockMvc.perform(
                delete("/bungae/" + bungaeId + "/quit")
                        .header("accessToken", accessToken));

        //then
        actions.andExpect(status().isOk())
                .andDo(print());
    }
}
