# -------------------------------
# 🧱 Stage 1: Build the app-shell
# -------------------------------
FROM node:20 AS build

# Set working directory
WORKDIR /app

# Copy dependency files
COPY package*.json ./
RUN npm ci

# Copy app-shell source
COPY . .

# Build for production
RUN npm run build


# -------------------------------
# 🚀 Stage 2: Serve with Nginx
# -------------------------------
FROM nginx:stable-alpine

# Copy build output to Nginx web root
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Run Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]