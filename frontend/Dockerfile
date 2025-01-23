FROM node:16

WORKDIR /app

COPY package.json /app
COPY package-lock.json /app

RUN npm install

# Run npm audit fix to fix vulnerabilities
RUN npm audit fix

COPY . /app

# Expose port 3000
EXPOSE 3000

# Set environment variable to fix OpenSSL error
ENV NODE_OPTIONS=--openssl-legacy-provider

CMD ["npm", "start"]