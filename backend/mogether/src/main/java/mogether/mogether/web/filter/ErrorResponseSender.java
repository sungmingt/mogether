package mogether.mogether.web.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletResponse;
import mogether.mogether.exception.MogetherException;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;

public class ErrorResponseSender {

    private ErrorResponseSender(){}

    public static void sendErrorResponse(HttpServletResponse response, MogetherException e) throws IOException {
        response.setStatus(e.getErrorCode().getStatus());
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("status", e.getErrorCode().getStatus());
        errorResponse.put("message", e.getMessage());

        ObjectMapper objectMapper = new ObjectMapper();
        String jsonResponse = objectMapper.writeValueAsString(errorResponse);
        try (PrintWriter writer = response.getWriter()) {
            writer.write(jsonResponse);
            writer.flush();
        }
    }
}
