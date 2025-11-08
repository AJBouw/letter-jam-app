# Stage 1: Use Node to copy artifacts (no build inside Docker)
FROM nginx:alpine AS production

# Create directories for features
RUN mkdir -p /usr/share/nginx/html/src/features/feature-home/dist \
    /usr/share/nginx/html/src/features/feature-login/dist \
    /usr/share/nginx/html/src/features/feature-quick-game/dist

# Copy prebuilt app-shell
COPY app-shell/dist /usr/share/nginx/html

# Copy prebuilt feature artifacts
COPY features/feature-home/dist /usr/share/nginx/html/src/features/feature-home/dist
COPY features/feature-login/dist /usr/share/nginx/html/src/features/feature-login/dist
COPY features/feature-quick-game/dist /usr/share/nginx/html/src/features/feature-quick-game/dist

# Expose nginx port
EXPOSE 80

# Default command
CMD ["nginx", "-g", "daemon off;"]