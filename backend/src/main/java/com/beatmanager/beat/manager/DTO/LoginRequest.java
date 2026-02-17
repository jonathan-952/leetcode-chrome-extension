package com.beatmanager.beat.manager.DTO;

public class LoginRequest {
    private String username;

    private String password;

    protected LoginRequest(String username, String password) {
        this.username = username;
        this.password = password;
    } 

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

}
