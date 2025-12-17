# Use Maven with Java 17 to build the app
FROM maven:3.9.6-eclipse-temurin-17

# Set working directory inside container
WORKDIR /app

# Copy everything from backend folder into container
COPY . .

# Build the Spring Boot application (skip tests for speed)
RUN mvn clean package -DskipTests

# Expose the port Spring Boot uses
EXPOSE 8080

# Run the generated JAR file
CMD ["java", "-jar", "target/*.jar"]
