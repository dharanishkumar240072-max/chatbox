# Build stage
FROM golang:alpine AS build
WORKDIR /app

# Copy the entire workspace so we can access the shared firebase key
COPY . .

WORKDIR /app/app-b/backend
RUN go build -o main .

# Run stage
FROM alpine:latest
WORKDIR /app/app-b/backend

# Copy the compiled binary
COPY --from=build /app/app-b/backend/main .

# (Optional) The firebase directory will be provided by Render Secret Files
# instead of being copied through Git.

RUN chmod +x main
EXPOSE 8080
CMD ["./main"]
