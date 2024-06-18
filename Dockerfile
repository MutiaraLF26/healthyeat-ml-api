# Use the Node.js 20 image
FROM node:20.14.0-slim

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the application port
EXPOSE 8000

# Define the command to run the application
CMD ["npm", "start"]