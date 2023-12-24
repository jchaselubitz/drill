FROM node:18-alpine
WORKDIR /app
RUN rm -rf ./*

COPY package.json yarn.lock ./

COPY . .
RUN yarn install --frozen-lockfile
ENV PORT 5173
EXPOSE 5173


CMD ["yarn", "dev"]
