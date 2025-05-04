# Use Ubuntu as the base image
FROM ubuntu

# Set the working directory [  means all folder are come in app folder    ]
WORKDIR /app 

# Install curl and Node.js
RUN apt-get update && apt-get install -y curl
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get install -y nodejs

# Copy package.json first to leverage Docker cache
COPY package.json ./

# Install dependencies inside the container
RUN npm install

# Copy the rest of the app
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Start the application
CMD ["node", "index.js"]


# agr hame build ke bakat hi ak command chahiye compile ke bakat nhi to multi stage use karenge# Stage 1: Build Stage
FROM ubuntu AS build

# Set the working directory
WORKDIR /app

# Install curl, nodejs, and other dependencies for build
RUN apt-get update && apt-get install -y curl
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy the rest of the app files
COPY . .

# Stage 2: Production Stage (with Nginx)
FROM ubuntu AS production

# Set the working directory for production
WORKDIR /app

# Install curl, Nginx, and nodejs for production runtime
RUN apt-get update && apt-get install -y curl nginx

# Install Node.js runtime for production
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# Copy the app and node_modules from build stage
COPY --from=build /app /app

# Copy the Nginx configuration (Make sure you have a `default.conf` file in your project)
COPY ./nginx/default.conf /etc/nginx/sites-available/default

# Expose the ports for both Nginx (80) and your app (3000)
EXPOSE 80 3000

# Start both Nginx and Node.js app using a shell script or a process manager
CMD service nginx start && node index.js
