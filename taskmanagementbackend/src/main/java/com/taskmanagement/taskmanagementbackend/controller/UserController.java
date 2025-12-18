package com.taskmanagement.taskmanagementbackend.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import java.util.Map;
import java.util.Collections;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @GetMapping("/me")
    public Map<String, Object> getUser(@AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            return Collections.emptyMap();
        }
        // Returns Google profile info like name, email, and picture URL
        return principal.getAttributes();
    }
}
