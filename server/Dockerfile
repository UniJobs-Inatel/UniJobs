# Use the official Node.js 20 image as the base image
FROM node:20

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and yarn.lock files
COPY package.json yarn.lock ./

# Install dependencies using Yarn
RUN yarn install --production

# Copy the rest of your application's code
COPY . .

# Build the NestJS application
RUN yarn build

# Make port 4000 available to the world outside this container
EXPOSE 4000

# Run the app when the container launches
CMD [ "node", "dist/main.js" ]
