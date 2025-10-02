#!/bin/sh

# Criar arquivo de tipos do Next.js se não existir
if [ ! -f "/app/next-env.d.ts" ]; then
    touch /app/next-env.d.ts
fi

# Garantir permissões corretas
chmod 644 /app/next-env.d.ts 2>/dev/null || true

# Iniciar aplicação
npm run dev


