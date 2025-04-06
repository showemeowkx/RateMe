#Build stage
FROM node:18 AS builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN npm run build

#Production stage
FROM node:18 AS production

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --only=production

COPY --from=builder /app/dist ./dist

CMD ["node", "dist/main"]
