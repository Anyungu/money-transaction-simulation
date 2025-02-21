
FROM node:22 AS builder

WORKDIR /app

ENV NODE_ENV=production

COPY public ./pulic
COPY package.json package-lock.json ./
RUN npm ci 

COPY . . 
RUN npm run build || true

RUN npm run extend 

# Stage 2: Production Stage
FROM node:22 AS runner

WORKDIR /app


COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/public ./public


ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

CMD ["node", "dist/app.js"]
