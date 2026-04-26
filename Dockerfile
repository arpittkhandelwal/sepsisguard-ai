# --- Build Frontend ---
FROM node:20 AS build-stage
WORKDIR /app
COPY sepsisguard-react/package*.json ./sepsisguard-react/
RUN cd sepsisguard-react && npm install
COPY sepsisguard-react/ ./sepsisguard-react/
RUN cd sepsisguard-react && npm run build

# --- Setup Backend & Serve ---
FROM node:20-slim
WORKDIR /app

# Copy built frontend
COPY --from=build-stage /app/sepsisguard-react/dist ./sepsisguard-react/dist

# Copy backend
COPY sepsisguard-backend/package*.json ./sepsisguard-backend/
RUN cd sepsisguard-backend && npm install --production
COPY sepsisguard-backend/ ./sepsisguard-backend/

EXPOSE 7860
ENV PORT=7860

WORKDIR /app/sepsisguard-backend
CMD ["node", "index.js"]
