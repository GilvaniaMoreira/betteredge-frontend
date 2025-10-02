# BetterEdge Platform - Frontend

Este é o frontend da plataforma BetterEdge, construído com Next.js 14, TypeScript, ShadCN UI, TanStack Query, React-Hook-Form e Zod.

## Tecnologias Utilizadas

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **ShadCN UI** - Biblioteca de componentes
- **TanStack Query** - Gerenciamento de estado servidor
- **React-Hook-Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas
- **Axios** - Cliente HTTP
- **Tailwind CSS** - Framework CSS
- **Docker** - Containerização da aplicação

## Docker

O projeto inclui configuração completa para Docker e Docker Compose:

- **Dockerfile**: Configuração para build da aplicação Next.js
- **docker-compose.yml**: Orquestração dos serviços
- **start.sh**: Script de inicialização do container

### Comandos Docker Úteis

```bash
# Build da imagem
docker build -t betteredge-frontend .

# Executar container
docker run -p 3000:3000 betteredge-frontend

# Executar em modo desenvolvimento com volume
docker run -p 3000:3000 -v $(pwd):/app betteredge-frontend
```

## Como Executar

### Opção 1: Docker Compose (Recomendado)

1. Configurar variáveis de ambiente:
```bash
cp env.local.example .env.local
```

2. Editar o arquivo `.env.local` com suas configurações:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

3. Subir a aplicação com Docker Compose:
```bash
docker compose up -d
```

4. Acessar a aplicação:
- Frontend: http://localhost:3000

5. Para parar a aplicação:
```bash
docker compose down
```

6. Para ver os logs:
```bash
docker compose logs -f betteredge-frontend
```

### Opção 2: Desenvolvimento Local

1. Instalar dependências:
```bash
npm install
```

2. Configurar variáveis de ambiente:
```bash
cp env.local.example .env.local
```

3. Executar em desenvolvimento:
```bash
npm run dev
```

## Estrutura de Rotas

- `/` - Página inicial (redireciona baseado na autenticação)
- `/login` - Página de login
- `/dashboard` - Dashboard principal
- `/clients` - Gestão de clientes
- `/assets` - Gestão de ativos
- `/allocations` - Gestão de alocações
- `/transactions` - Gestão de transações

## Padrões de Desenvolvimento

### Componentes
- Componentes reutilizáveis em `components/ui/`
- Componentes de formulário em `components/forms/`
- Componentes de layout em `components/layout/`

### Hooks
- Custom hooks em `hooks/`
- Hooks do TanStack Query em `queries/`

### Serviços
- Serviços da API em `services/`
- Configuração do Axios em `lib/api.ts`

### Validação
- Schemas Zod em `schemas/`
- Validação de formulários com React-Hook-Form

### Tipos
- Interfaces TypeScript em `types/`
- Tipos derivados dos schemas Zod


