package br.com.phricardo.listvideo.dto.request.mapper;

import br.com.phricardo.listvideo.dto.request.EmailNotificationRequest;
import br.com.phricardo.listvideo.model.EmailNotification;
import org.mapstruct.Mapper;

import static org.mapstruct.MappingConstants.ComponentModel.SPRING;

@Mapper(componentModel = SPRING)
public interface MailgunRequestMapper {

    EmailNotificationRequest toRequest(EmailNotification request);
}