# Use the official Node.js image.
# https://hub.docker.com/_/node
FROM node:14

# Install necessary dependencies
RUN apt-get update && apt-get install -y libxshmfence1

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install app dependencies including Playwright browsers
RUN npm install && npx playwright install

# Bundle app source
COPY . .

# Expose the port the app runs on
EXPOSE 3300

# Define environment variable
ENV PORT=3300

# Run the application
CMD [ "npm", "start" ]
