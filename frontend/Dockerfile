FROM node:22

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE ${FRONT_PORT}

CMD ["npm", "run", "start"]
