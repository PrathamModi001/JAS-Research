# Use the official Node.js image from the Docker Hub
FROM node:18

# Create and set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port your application runs on
EXPOSE 8000

# Command to run the application
CMD ["npm", "start"]
