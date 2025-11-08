# Stage 1: base Nginx
FROM nginx:alpine

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

# 4️⃣ Expose Nginx port
EXPOSE 80

# 5️⃣ Start Nginx
CMD ["nginx", "-g", "daemon off;"]