FROM node:lts

# Create and set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install --only=prod

# Copy the rest of the application code
COPY . .

# Expose the port your app runs on
EXPOSE 9000

# Command to run your app
CMD ["npm", "start"]
