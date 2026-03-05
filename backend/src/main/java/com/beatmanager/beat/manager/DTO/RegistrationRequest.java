package com.beatmanager.beat.manager.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegistrationRequest {
    private String email;

    private String password;

    private String username;

    public RegistrationRequest(String email, String password, String username) {
        this.email = email;
        this.password = password;
        this.username = username;
    }
}
