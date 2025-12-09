package br.com.phricardo.listvideo.dto.request;


import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmailNotificationRequest {
    @NotBlank
    private String to;
    @NotBlank
    private String subject;
    @NotBlank
    private String htmlContent;
}