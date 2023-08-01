FROM node:current-alpine

WORKDIR /app

COPY . .

ENV PORT=8000
ENV POSTGRES_PORT=5432
ENV POSTGRES_PASSWORD=academy
ENV REDIS_HOST=localhost
ENV REDIS_PORT=6379
ENV DATABASE_URL="postgresql://postgres:academy@localhost:5432/postgres?schema=public"
ENV API_KEY="MY_API_KEY"

RUN npm install
RUN npm run build
RUN npm run migrate:prod

EXPOSE 8000/TCP

CMD ["node", "dist/index.js"]
