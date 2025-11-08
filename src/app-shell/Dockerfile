# Stage 0: Build Node app
FROM node:20-alpine AS build

WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build

# Stage 1: Serve with nginx
FROM nginx:alpine

# Clean default html
RUN rm -rf /usr/share/nginx/html/*

# Copy compiled dist and assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /app/src/assets /usr/share/nginx/html/assets

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]