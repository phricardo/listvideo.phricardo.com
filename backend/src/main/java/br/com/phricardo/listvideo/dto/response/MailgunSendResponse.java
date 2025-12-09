package br.com.phricardo.listvideo.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class MailgunSendResponse {

    @JsonProperty("id")
    private String id;

    @JsonProperty("message")
    private String message;
}