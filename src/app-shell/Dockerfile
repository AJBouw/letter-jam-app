# Stage 1: Build (optional, if app-shell build already done in CI)
FROM node:20-alpine AS build
WORKDIR /app
COPY app-shell/dist /usr/share/nginx/html

# Stage 2: Nginx
FROM nginx:alpine
COPY --from=build /usr/share/nginx/html /usr/share/nginx/html

# Copy features
COPY features/feature-home/dist /usr/share/nginx/html/src/features/feature-home/dist
COPY features/feature-login/dist /usr/share/nginx/html/src/features/feature-login/dist
COPY features/feature-quick-game/dist /usr/share/nginx/html/src/features/feature-quick-game/dist

EXPOSE 80