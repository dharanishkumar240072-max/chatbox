# Build stage
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copy the entire workspace so we can access the shared firebase key
COPY . .

WORKDIR /app/app-a/backend
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy the compiled jar
COPY --from=build /app/app-a/backend/target/*.jar app.jar

# Render mounts secret files at /etc/secrets/. We symlink it to where the Java code expects it.
RUN mkdir -p /firebase && ln -s /etc/secrets/serviceAccountKey.json /firebase/serviceAccountKey.json

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
