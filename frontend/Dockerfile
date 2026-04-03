# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration production

# Stage 2: Runtime
FROM nginx:alpine
COPY --from=build /app/dist/materre-frontend/browser /usr/share/nginx/html
# Copier une config nginx personnalisée pour gérer le routage Angular (SPA)
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
