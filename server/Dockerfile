# Base image for Node.js
FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire backend code into the container
COPY . .

# Generate Prisma client (if applicable)
RUN npx prisma generate

# Expose the server port
EXPOSE 8080

# Run the server
CMD ["npm", "run", "dev"]
