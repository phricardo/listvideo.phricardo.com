FROM maven:3.9.6-amazoncorretto-21 as build
WORKDIR /app
COPY . .

RUN mvn clean package -DskipTests && \
    cp target/*.jar app.jar

FROM eclipse-temurin:21-jdk as runtime
WORKDIR /app

COPY --from=build /app/app.jar /app/app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
