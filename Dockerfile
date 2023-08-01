FROM node:current-alpine

WORKDIR /app

COPY . .

ENV CORS=yes
ENV PORT=8000
ENV REDIS_HOST=localhost
ENV REDIS_PORT=6379
ENV DATABASE_URL="postgresql://postgres:academy@localhost:5432/postgres?schema=public"
ENV API_KEY="MY_API_KEY"

RUN npm install
RUN npm run build

EXPOSE 8000/TCP

CMD ["npm", "run", "start:migrate:prod"]
