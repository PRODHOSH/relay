FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy source files
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build Next.js application
# Note: In a real production deployment, you might want to pass env variables during build
RUN npm run build

# The command to run will be specified in docker-compose.yml
# Either `npm start` for the frontend or `node worker.js` for the worker
CMD ["npm", "start"]
