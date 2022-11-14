# syntax=docker/dockerfile:1
FROM node:17-alpine AS BASE_IMAGE

WORKDIR /app
COPY . .
RUN yarn install
RUN npx prisma generate
RUN yarn prebuild && yarn build

FROM node:17-alpine
WORKDIR /app
COPY --from=BASE_IMAGE /app/prisma /app/prisma
COPY --from=BASE_IMAGE /app/dist /app/dist
COPY --from=BASE_IMAGE /app/node_modules /app/node_modules
EXPOSE 3000

CMD ["node", "dist/main.js"]
