FROM node:18

ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json", "./"]

RUN npm ci --production

COPY build/dist/* .

CMD ["node", "index.js"]
