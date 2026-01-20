# Use the official Node.js LTS image as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json into the container
COPY package*.json ./
COPY . . 
# Install the application dependencies
# RUN npm install --only=production
RUN npm ci
RUN npm run build

# Copy the application code into the container
# COPY . .
# Expose the port the application will run on
EXPOSE 3000

# Define the command to start the application
CMD ["npm", "run", "server"]
