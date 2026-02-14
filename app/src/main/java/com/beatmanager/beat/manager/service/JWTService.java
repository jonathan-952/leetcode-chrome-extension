package com.beatmanager.beat.manager.service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JWTService {

    @Value("${JWT_SECRET}")
    private String jwtSecret;

    public String getSecretKey() {
        return jwtSecret;
    }

    public String generateToken(String username) {
        // generate token

        Map<String, Object> claims = new HashMap<>();

        return Jwts
        .builder()
        .claims()
        .add(claims)
        .subject(username)
        .expiration(new Date(System.currentTimeMillis() + 2 * 60 * 60 * 1000))
        .issuedAt(new Date())
        .and()
        .signWith(getKey())
        .compact();
    }

    private Key getKey() {
        byte[] keyBytes = Decoders.BASE64.decode(getSecretKey());
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
