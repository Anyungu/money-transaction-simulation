# Stage 1: Build Stage
FROM node:22 AS builder

WORKDIR /app

# Set environment to avoid installing devDependencies later
ENV NODE_ENV=production

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci 

# Copy the rest of the project and build
COPY . . 
RUN npm run build || true

# If extend modifies build outputs, keep it here
RUN npm run extend 

# Stage 2: Production Stage
FROM node:22 AS runner

WORKDIR /app

# Copy only what's needed for production
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

# Start the application
CMD ["node", "dist/app.js"]
