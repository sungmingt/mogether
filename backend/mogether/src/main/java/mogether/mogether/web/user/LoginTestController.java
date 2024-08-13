package mogether.mogether.web.user;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@Slf4j
public class LoginTestController {

    @GetMapping("/")
    @ResponseBody
    public String home() {
        return "good";
    }

    @GetMapping("/login")
    public String login() {
        return "loginForm";
    }
}
