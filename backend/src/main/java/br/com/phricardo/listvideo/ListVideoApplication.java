package br.com.phricardo.listvideo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@EnableFeignClients
@SpringBootApplication
public class ListVideoApplication {

  public static void main(String[] args) {
    SpringApplication.run(ListVideoApplication.class, args);
  }
}
