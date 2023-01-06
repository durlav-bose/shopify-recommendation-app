FROM node:18-alpine

ENV HOST="https://rec-app.socialcommerceguys.com" \
    SCOPES="write_products" \
    SHOPIFY_API_KEY="095ffc2c3b2acc9de81fdc813cc46fe8" \
    SHOPIFY_API_SECRET="f6923fa8163810a9674d04e0a68a98a4" \
    PORT=4502
EXPOSE 4502
WORKDIR /app
COPY web .
RUN npm install
RUN cd frontend && npm install && npm run build
CMD ["npm", "run", "serve"]
