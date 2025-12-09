package br.com.phricardo.listvideo.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmailNotification {
    private String to;
    private String subject;
    private String htmlContent;
}