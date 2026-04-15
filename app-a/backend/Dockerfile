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

# Copy the shared firebase directory to the expected relative path
COPY --from=build /app/firebase /firebase

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
