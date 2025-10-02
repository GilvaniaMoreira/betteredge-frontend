FROM node:18-alpine

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Criar arquivo de tipos do Next.js
RUN touch next-env.d.ts

# Build da aplicação
RUN npm run build

# Remover dependências de desenvolvimento
RUN npm prune --production

EXPOSE 3000

CMD ["npm", "start"]