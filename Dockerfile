# Dockerfile
FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy the JAR file built by build.sh
COPY dist/*.jar app.jar

# Default command to run the JAR
ENTRYPOINT ["java", "-jar", "app.jar"]
