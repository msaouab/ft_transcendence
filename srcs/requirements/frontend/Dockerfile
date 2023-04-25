#frontend

# Use an official Node runtime as a parent image
FROM node:14-alpine

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project files to the working directory
COPY . .

# Build the React app
# RUN npm run build

# Expose port 80
EXPOSE 80

# Start the app
CMD ["npm", "run",  "dev"]
