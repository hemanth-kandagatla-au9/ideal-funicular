# Build Stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --force

# Copy the rest of the application
COPY . ./

# Build the production-ready application
# RUN npm run build
ENV GENERATE_SOURCEMAP=false
RUN NODE_OPTIONS="--max-old-space-size=4096" npm run build

# Production Stage
FROM nginx:stable-alpine AS production

# Copy only the built files to the production image
COPY --from=builder /app/build /usr/share/nginx/html

# Add custom Nginx configuration for SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
