# Use the Node.js 20 image
FROM node:20

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# # Set environment variables
# ENV MODEL_URL='https://storage.googleapis.com/gcp-sofyanegi/submissions-model/model.json'

# ENV PROJECT_ID='gcp-sofyanegi'
# ENV DATABASE_ID='(default)'
# ENV PORT=8080

# Expose the application port
EXPOSE 8080

# Define the command to run the application
CMD ["npm", "start"]