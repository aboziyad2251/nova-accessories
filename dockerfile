# 1. Use the official Node.js image as a starting point
FROM node:18-alpine

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy your package files and install dependencies
COPY package*.json ./
RUN npm install

# 4. Copy the rest of your app's source code
COPY . .

# 5. The command to start your app
CMD ["npm", "start"]