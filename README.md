# IRIS - Inventário, Registro e Integração de Sistema

Um sistema completo e profissional de gerenciamento de inventário, desenvolvido com tecnologias modernas para oferecer uma experiência intuitiva e eficiente.

## 🎯 Sobre o Projeto

IRIS é uma solução integrada que combina um backend robusto com Node.js/Express e um frontend desktop elegante com Electron + React, permitindo o controle total do seu inventário de produtos, categorias e histórico de transações.

## 🚀 Tecnologias Utilizadas

### Backend
- **Node.js** com Express.js
- **Banco de Dados** Relacional
- **Autenticação** JWT
- **Upload de Imagens** Multer

### Frontend
- **React 18+** com TypeScript
- **Vite** para build otimizado
- **Electron** para aplicação desktop
- **TailwindCSS** para estilização
- **Axios** para requisições HTTP

## 📋 Funcionalidades

- ✅ Autenticação de usuários
- ✅ Gerenciamento de categorias de produtos
- ✅ Cadastro e listagem de produtos
- ✅ Controle de estoque com modelos e códigos únicos
- ✅ Upload e exibição de imagens dos produtos
- ✅ Histórico completo de transações
- ✅ Preços unitários configuráveis
- ✅ Aplicação desktop com Electron

## 🛠️ Instalação

### Pré-requisitos
- Node.js (v14 ou superior)
- npm ou yarn

### Setup Backend
```bash
cd backend
npm install
npm start
```

### Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

### Build Desktop (Electron)
```bash
cd frontend
npm run build
```

## 📂 Estrutura do Projeto

```
iris/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middlewares/
│   │   ├── config/
│   │   ├── app.js
│   │   └── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── modules/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── electron/
│   └── package.json
└── README.md
```

## 🔧 Variáveis de Ambiente

Crie um arquivo `.env` na pasta backend com as seguintes variáveis:

```env
PORT=5000
DATABASE_URL=your_database_url
JWT_SECRET=your_secret_key
NODE_ENV=development
```

## 📝 Licença

Este projeto está licenciado sob a Licença MIT.

## 👨‍💻 Autor

Sistema desenvolvido por Matheus Fernandes para gerenciamento eficiente de inventários.
