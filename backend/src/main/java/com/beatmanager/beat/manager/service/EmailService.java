package com.beatmanager.beat.manager.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

public class EmailService {
        @Autowired
    private JavaMailSender emailSender;

    public void sendVerificationEmail(String to, String token) throws MessagingException {
        MimeMessage message = emailSender.createMimeMessage();

        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        String verificationUrl = "https://lcrecall.xyz/verify_email?token=" + token;

        helper.setTo(to);
        helper.setSubject("Verify your email");
        helper.setText("<p>Thanks for signing up! Click below to verify your email:</p>" +
            "<a href='" + verificationUrl + "'>Verify Email</a>",true);

        emailSender.send(message);

    }

}
