package mogether.mogether.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import mogether.mogether.domain.info.Address;
import mogether.mogether.domain.info.Gender;
import mogether.mogether.domain.info.SocialType;
import mogether.mogether.domain.oauth.AppUser;
import mogether.mogether.domain.token.TokenProvider;
import mogether.mogether.domain.user.User;
import mogether.mogether.domain.user.UserRepository;
import mogether.mogether.web.user.dto.PasswordUpdateRequest;
import mogether.mogether.web.user.dto.UserJoinRequest;
import mogether.mogether.web.user.dto.UserUpdateRequest;
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

import java.nio.charset.StandardCharsets;

import static mogether.mogether.application.user.UserValidator.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ActiveProfiles("test")
@AutoConfigureMockMvc
@SpringBootTest
class UserTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TokenProvider tokenProvider;

    @Autowired
    private ObjectMapper objectMapper;

    private String accessToken;
    private User user;

    @BeforeEach
    void beforeEach() {
        user = userRepository.save(new User("minjae123@gmail.com", encodePassword("Password123@"), SocialType.NONE, "kim", new Address(), 20, Gender.MALE, "", ""));
        accessToken = tokenProvider.createAccessToken(user.getId());
    }

    @DisplayName("유저의 회원가입 요청에 성공적으로 응답한다")
    @Test
    void userJoinTest() throws Exception {
        //given
        UserJoinRequest requestDto = new UserJoinRequest("testUser123@gmail.com", "Pass123@", "testUser", new Address(), 20, "MALE", "", "");
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
                MockMvcRequestBuilders.multipart(HttpMethod.POST, "/user/join")
                        .file(imagesPart)
                        .file(dtoPart)
                        .accept(MediaType.APPLICATION_JSON)
                        .contentType(MediaType.MULTIPART_FORM_DATA)
                        .header("accessToken", accessToken));

        //then
        actions.andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value(requestDto.getEmail()))
                .andDo(print());
    }

    @DisplayName("유저의 회원정보 수정 요청에 성공적으로 응답한다")
    @Test
    void userUpdateTest() throws Exception {
        //given
        UserUpdateRequest requestDto = new UserUpdateRequest("testUser", new Address(), 20, "MALE", "", "");
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
                MockMvcRequestBuilders.multipart(HttpMethod.PATCH, "/user/" + user.getId())
                        .file(imagesPart)
                        .file(dtoPart)
                        .accept(MediaType.APPLICATION_JSON)
                        .contentType(MediaType.MULTIPART_FORM_DATA)
                        .header("accessToken", accessToken));

        //then
        actions.andExpect(status().isOk())
                .andExpect(jsonPath("$.nickname").value(requestDto.getNickname()))
                .andDo(print());
    }

    @DisplayName("유저의 비밀번호 변경 요청에 성공적으로 응답한다")
    @Test
    void userPasswordUpdateRequest() throws Exception {
        //given
        PasswordUpdateRequest requestDto = new PasswordUpdateRequest("Password123@", "newPassword123@");
        String content = objectMapper.writeValueAsString(requestDto);

        //when
        ResultActions actions = mockMvc.perform(
                MockMvcRequestBuilders.patch("/user/" + user.getId() + "/password")
                        .content(content)
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("accessToken", accessToken));

        // then
        actions.andExpect(status().isOk())
                .andDo(print());
    }

    @DisplayName("유저 정보 조회 요청에 성공적으로 응답한다")
    @Test
    void getUserInfoTest() throws Exception {
        //given
        Long userId = user.getId();

        //when
        ResultActions actions = mockMvc.perform(
                MockMvcRequestBuilders.get("/user/" + userId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("accessToken", accessToken));

        // then
        actions.andExpect(status().isOk())
                .andExpect(jsonPath("$.nickname").value(user.getNickname()))
                .andExpect(jsonPath("$.email").value(user.getEmail()))
                .andDo(print());
    }
}