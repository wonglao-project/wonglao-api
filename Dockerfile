FROM node:current-alpine

WORKDIR /app
COPY . .

ENV PORT=8000
ENV POSTGRES_PORT=5432
ENV POSTGRES_PASSWORD=academy

RUN npm install
RUN npm run build

CMD ["node", "dist/index.js"]
