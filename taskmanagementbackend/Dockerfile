FROM maven:3.9.8-eclipse-temurin-21

WORKDIR /app

# Copy pom and fetch dependencies (improves build caching)
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy source and build
COPY src ./src
RUN mvn clean package -DskipTests

EXPOSE 8080

# Use the specific filename defined in <finalName>
CMD ["java", "-jar", "target/taskmanagementbackend.jar"]
