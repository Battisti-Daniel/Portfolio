# Portfólio Pessoal

Site de portfólio pessoal full stack: sobre mim, projetos, planos e blog — com painel administrativo protegido por login para editar tudo pelo navegador.

- **Backend:** Spring Boot 4 (Java 21), Spring Security com JWT, Spring Data JPA, PostgreSQL
- **Frontend:** Angular 22 (standalone components, signals), TypeScript

## Estrutura

```
portfolio/
  backend/            Spring Boot (API REST)
  frontend/           Angular (site público + painel /admin)
  docker-compose.yml  PostgreSQL para desenvolvimento
```

## Pré-requisitos

- Java 21+ (o projeto usa o Maven Wrapper, não precisa instalar o Maven)
- Node.js 20+ e npm
- Docker Desktop (para o PostgreSQL) — ou um PostgreSQL próprio, veja abaixo

## Como rodar

### 1. Banco de dados

```bash
docker compose up -d
```

Isso sobe um PostgreSQL local na porta `5432` com banco `portfolio`, usuário `portfolio` e senha `portfolio` (definidos em `docker-compose.yml`).

Se preferir usar um PostgreSQL já existente, ajuste as variáveis de ambiente `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` ao rodar o backend (veja `backend/src/main/resources/application.properties`).

### 2. Backend

```bash
cd backend
./mvnw spring-boot:run
```

A API sobe em `http://localhost:8080`. Na primeira execução, o backend cria automaticamente:

- Um usuário admin (`admin` / `admin123` por padrão — **troque isso**, veja abaixo)
- Um perfil, projetos, planos e um post de blog de exemplo, para o site não começar vazio

### 3. Frontend

```bash
cd frontend
npm install
npm start
```

O site sobe em `http://localhost:4200` e já aponta para a API em `http://localhost:8080/api` (configurado em `frontend/src/environments/`).

## Painel administrativo

Acesse `http://localhost:4200/admin` (ou o link "Área administrativa" no rodapé do site) para entrar com o usuário admin e editar:

- **Perfil** — nome, título, bio, foto, e-mail, redes sociais
- **Projetos** — criar, editar e excluir
- **Planos** — roteiro/objetivos, com status (planejado, em andamento, concluído)
- **Blog** — posts em Markdown, com rascunho/publicado

### Trocando as credenciais do admin

**Importante:** troque o usuário/senha padrão antes de publicar o site. Defina as variáveis de ambiente ao rodar o backend:

```bash
ADMIN_USERNAME=seu_usuario ADMIN_PASSWORD=uma_senha_forte ./mvnw spring-boot:run
```

Isso só tem efeito a primeira vez (quando o usuário admin ainda não existe no banco). Se quiser trocar depois, atualize direto na tabela `users` ou apague o banco e recrie.

Também troque o segredo do JWT em produção:

```bash
JWT_SECRET=uma-chave-bem-longa-e-aleatoria ./mvnw spring-boot:run
```

## Personalizando o conteúdo

Todo o conteúdo (perfil, projetos, planos, posts) é editável pelo painel `/admin` — não é necessário mexer em código para atualizar as informações do dia a dia.

Para mudar o visual (cores, fontes, espaçamentos), o design system fica em `frontend/src/styles.css` (variáveis CSS no `:root`).

## Build de produção

```bash
# Backend
cd backend
./mvnw clean package
java -jar target/portfolio-backend-0.0.1-SNAPSHOT.jar

# Frontend
cd frontend
npm run build
# arquivos estáticos gerados em frontend/dist/frontend/browser
```

Lembre-se de ajustar `frontend/src/environments/environment.ts` (`apiUrl`) e as variáveis de ambiente do backend (`CORS_ALLOWED_ORIGINS`, `DB_*`, `ADMIN_*`, `JWT_SECRET`) para os endereços reais de produção.
