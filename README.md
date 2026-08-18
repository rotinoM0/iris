<div align="center">
  <img align="center" src="https://github.com/user-attachments/assets/d9d65647-4957-4aca-a98c-3455ad0e0430" alt="iris logo">
</div>

---

# Inventário, Registro e Integração de Sistema (IRIS)

Um sistema completo de gerenciamento de inventário para controle de produtos, estoque, categorias e histórico de transações, entregue como aplicação desktop (Electron) com backend próprio em Node.js.

## Sobre o Projeto

O **IRIS** é uma solução integrada que combina:

- **Backend** robusto com Node.js + Express e MongoDB (Mongoose);
- **Frontend desktop** elegante com Electron + React + TypeScript e Vite;
- **Autenticação** por JWT com perfis `admin` e `user`;
- **Upload de imagens** direto para o Cloudinary;
- **Histórico completo** de todas as operações realizadas no estoque.

## Funcionalidades

- ✅ Autenticação de usuários (login e registro) com JWT
- ✅ Controle de acesso por perfil: `admin` e `user`
- ✅ Gerenciamento de categorias com modelos e códigos únicos
- ✅ Cadastro, edição e listagem de produtos
- ✅ Controle de estoque por variante (código + cor)
- ✅ Movimentação de estoque: entrada, saída e balanço
- ✅ Upload e exibição de imagens dos produtos (Cloudinary)
- ✅ Histórico de transações com filtro por tipo e busca
- ✅ Dashboard com indicadores e estatísticas
- ✅ Aplicação desktop empacotada para Windows e Linux (Electron)

<img width="1920" height="1020" alt="iris" src="https://github.com/user-attachments/assets/e340fd4e-d2b3-4688-811c-a4c84eed3a67" />

## Tecnologias Utilizadas

### Backend
| Tecnologia | Uso |
|---|---|
| Node.js + Express | API REST |
| MongoDB + Mongoose | Banco de dados NoSQL |
| JSON Web Token (JWT) | Autenticação |
| Bcrypt | Hash de senhas |
| Cloudinary + Multer | Upload de imagens |
| express-rate-limit | Limitação de requisições |
| Helmet | Headers de segurança |
| CORS | Controle de origens permitidas |

### Frontend
| Tecnologia | Uso |
|---|---|
| React 18 + TypeScript | Interface |
| Vite | Build e dev server |
| Electron | Aplicação desktop |
| TailwindCSS | Estilização |
| Axios | Requisições HTTP |
| Recharts | Gráficos do dashboard |
| React Router | Navegação |

## Estrutura do Projeto

```
iris/
├── backend/
│   ├── scripts/
│   │   ├── migrate-to-irisdb.js     # Migração one-shot entre bancos
│   │   └── fix-historico-data.js    # Backfill de datas do histórico
│   └── src/
│       ├── config/                  # env, database, upload (Cloudinary/Multer)
│       ├── controllers/             # category, history, item, user
│       ├── middlewares/             # auth, errorHandler, isAdmin, rateLimiter
│       ├── models/                  # category, history, item, user, index
│       ├── routes/                  # category, history, item, user, index
│       ├── services/                # category, history, item, user
│       ├── utils/                   # validate (validação + sanitização)
│       ├── app.js
│       └── server.js
├── frontend/
│   ├── electron/
│   │   ├── main.ts                  # Janela e webPreferences seguras
│   │   ├── preload.ts               # Bridge mínima (somente leitura)
│   │   └── electron-env.d.ts
│   ├── src/
│   │   ├── components/              # Header, Items, Footer
│   │   ├── context/                 # AuthContext (sessão/role)
│   │   ├── modules/                 # Kebab, modais (Produto, Editar, Estoque, Categoria, Histórico)
│   │   ├── pages/                   # Dashboard, Login/Register, Estoque, Init
│   │   ├── services/                # api (axios), historyService
│   │   ├── config.ts                # URL da API
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── electron-builder.yml         # Config única do empacotamento
│   └── vite.config.ts
└── README.md
```

## Instalação

### Pré-requisitos
- Node.js (18+)
- npm
- MongoDB (local ou Atlas)

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env   # configure as variáveis abaixo
npm start
```

O servidor sobe em `http://localhost:5000` por padrão.

### 2. Frontend (desenvolvimento)

```bash
cd frontend
npm install
npm start        # sobe o Vite e abre o Electron juntos
```

- `npm run dev` — apenas o Vite (navegador em `http://localhost:5173`);
- `npm start` — Vite + aplicação desktop.

### 3. Build Desktop

```bash
cd frontend
npm run build:win       # instalador Windows (NSIS)
npm run build:linux     # AppImage + deb
```

O pacote sai na pasta `frontend/release/`. A configuração de empacotamento vive em `frontend/electron-builder.yml`.

## Variáveis de Ambiente

Crie um arquivo `.env` na pasta `backend` (veja o modelo em `.env.example`):

```env
PORT=5000                # Porta do servidor Express
MONGO_URI=               # URL de conexão do MongoDB (ex: mongodb+srv://user:pass@host/dbname)
JWT_SECRET=              # Chave secreta dos tokens JWT
JWT_EXPIRE=7d            # Expiração dos tokens (ex: 1d, 12h)

CLOUDINARY_NAME=         # Nome da conta Cloudinary
CLOUDINARY_KEY=          # API Key da conta Cloudinary
CLOUDINARY_SECRET=       # API Secret da conta Cloudinary
```

A URL da API consumida pelo frontend fica em `frontend/src/config.ts`.

## Modelo de Dados

| Coleção | Descrição |
|---|---|
| `users` | Usuários: `nome`, `senha` (hash bcrypt, nunca exposta), `cargo` (`admin`/`user`), timestamps |
| `items` | Produtos: `nome`, `catProduto`, `catModelo`, `codigo`, `estoqueTotal`, `preco`, `imagem` (`url`, `public_id`) e `var[]` (variantes com `codigo`, `cor`, `estoque`) |
| `categories` | Categorias: `produto`, `codigo` e `modelos[]` (`nome`, `codigo`) |
| `historico` | Transações: `item`, `tipo` (`entrada`, `saida`, `balanco`, `adicionado`, `alterado`, `removido`), `quantidade`, `data` (Date), `observacao`, `usuario` |

## API

Todas as rotas, exceto login e registro, exigem o header `Authorization: Bearer <token>`.

### Autenticação
| Método | Rota | Descrição | Perfil |
|---|---|---|---|
| POST | `/api/auth/login` | Login e retorno de token | público (rate limit) |
| POST | `/api/auth/register` | Criação de conta | público (rate limit) |
| GET | `/api/auth/users/me` | Dados do usuário logado | autenticado |
| GET | `/api/auth/users` | Lista de usuários | admin |
| GET | `/api/auth/users/:id` | Detalhe de usuário | admin |

### Itens
| Método | Rota | Descrição | Perfil |
|---|---|---|---|
| GET | `/api/items` | Lista todos os itens | autenticado |
| GET | `/api/items/:id` | Detalhe de um item | autenticado |
| GET | `/api/items/categorias/:catProduto` | Itens de uma categoria | autenticado |
| GET | `/api/items/:id/estoque` | Estoque por código da variante | autenticado |
| POST | `/api/items` | Cadastro de item (multipart, com imagem) | autenticado |
| PATCH | `/api/items/:id` | Atualização de item | autenticado |
| PATCH | `/api/items/:id/estoque` | Movimentação de estoque (entrada/saída) | autenticado |
| PATCH | `/api/items/:id/var` | Exclusão de variante | admin |
| DELETE | `/api/items/:id` | Exclusão de item | admin |

### Categorias
| Método | Rota | Descrição | Perfil |
|---|---|---|---|
| GET | `/api/categories` | Lista categorias | autenticado |
| GET | `/api/categories/modelos` | Lista todos os modelos | autenticado |
| GET | `/api/categories/:id/modelos` | Modelos de uma categoria | autenticado |
| POST | `/api/categories` | Cria categoria | autenticado |
| PATCH | `/api/categories/:id` | Adiciona modelo | autenticado |
| PATCH | `/api/categories/:id/modelos` | Exclui modelo | admin |
| DELETE | `/api/categories/:id` | Exclui categoria | admin |

### Histórico
| Método | Rota | Descrição | Perfil |
|---|---|---|---|
| GET | `/api/history` | Lista o histórico (filtros `type` e `filter`) | autenticado |
| POST | `/api/history` | Registra uma transação | autenticado |

## Segurança

- **Helmet** — headers HTTP seguros;
- **CORS allowlist** — apenas origens conhecidas (`localhost:5173`/`5000`); o app Electron carrega conteúdo local;
- **Rate limiting** — 10 tentativas por 15 min em login/registro;
- **JWT** com expiração, validado a cada requisição; senhas com bcrypt e campo `select: false`;
- **Validação e sanitização** das entradas e dos filtros de busca (`utils/validate.js`);
- **RBAC** — ações sensíveis (exclusão de itens/categorias, gestão de variantes/modelos, listagem de usuários) exigem perfil `admin`;
- **Error handler global** — não vaza stack traces em produção;
- **Electron hardening** — `contextIsolation: true`, `sandbox: true`, `nodeIntegration: false`, preload mínimo e somente leitura (nenhum canal de IPC exposto) e Content Security Policy no `index.html`.

## Scripts Utilitários

Migram/ajustam dados diretamente no MongoDB (rodar a partir de `backend/`, com `.env` configurado):

```bash
node scripts/migrate-to-irisdb.js   # copia collections entre bancos e promove admin
node scripts/fix-historico-data.js  # converte datas do histórico para Date
```

## Roadmap

- [x] Autenticação, RBAC e segurança do backend
- [x] Gestão de itens, categorias, estoque e histórico
- [x] Dashboard com indicadores
- [x] Hardening da aplicação Electron (preload, CSP, build)
- [ ] Relatórios e exportação (CSV/PDF)
- [ ] Suporte a múltiplos depósitos
- [ ] Notificações de estoque mínimo

## Licença

Este projeto está licenciado sob a Licença MIT.

## Autor

Sistema desenvolvido por Matheus Fernandes para gerenciamento eficiente de inventários.
