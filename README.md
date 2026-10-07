# Box ERP)

Sistema de gestão de produtos, estoque e entrada de notas fiscais XML. Os dados são armazenados em SQLite usando Sequelize; a base começa vazia.

## Arquitetura Separada (Backend + Frontend)

O projeto foi desacoplado de uma estrutura monolítica para uma arquitetura em duas camadas independentes:

```
nexstock-erp/
├── backend/                  # Servidor API REST (Node.js + Express + TypeScript)
│   ├── src/
│   │   ├── routes/
│   │   │   ├── products.ts   # Endpoints de produtos, saldos e ficha fiscal
│   │   │   ├── movements.ts  # Endpoints de movimentações de estoque
│   │   │   ├── transfers.ts  # Endpoints de transferências entre filiais
│   │   │   └── invoices.ts   # Endpoints de notas fiscais, XML e SEFAZ
│   │   ├── data/
│   │   │   └── store.ts      # Modelos Sequelize e acesso ao SQLite
│   │   ├── types.ts          # Definições de tipos de dados do domínio
│   │   └── server.ts         # Ponto de entrada Express (porta 3001)
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                 # Aplicação SPA (React 19 + Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/       # Componentes visuais, Header, Sidebar, Modais e Views
│   │   ├── services/
│   │   │   └── api.ts        # Camada de comunicação com a API REST
│   │   ├── types.ts          # Interfaces e contratos do frontend
│   │   ├── App.tsx           # Aplicação principal
│   │   ├── main.tsx
│   │   └── index.css
│   ├── public/
│   ├── index.html
│   ├── vite.config.ts        # Configuração do Vite com proxy reverso para /api
│   ├── package.json
│   └── tsconfig.json
│
├── scripts/
│   └── dev.mjs               # Script para executar Backend e Frontend simultaneamente
└── package.json              # Scripts principais na raiz
```

---

## Como Executar

### 1. Iniciar Tudo (Backend + Frontend)
Na raiz do projeto:
```bash
npm run dev
```
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

O banco é criado automaticamente em `backend/data/box.sqlite` na primeira inicialização. Esse arquivo é local e fica fora do Git. Para usar outro caminho, defina `DATABASE_PATH` no ambiente do backend.

O sistema não carrega produtos ou notas de demonstração. Cadastros, ajustes de saldo, importações e confirmações ficam persistidos localmente. Ao importar uma NF-e, revise os produtos e vincule os códigos antes de confirmar; a confirmação atualiza os saldos e grava as movimentações e o XML original.

Os recursos de transmissão e consulta à SEFAZ não estão conectados. O formulário de emissão grava apenas um rascunho interno; ele não autoriza documentos fiscais.

### 2. Iniciar Apenas o Backend
```bash
npm run dev:backend
# ou
cd backend && npm run dev
```

### 3. Iniciar Apenas o Frontend
```bash
npm run dev:frontend
# ou
cd frontend && npm run dev
```

### 4. Build de Produção
```bash
npm run build
```

### 5. Verificação de Tipos (TypeScript Lint)
```bash
npm run lint
```

---

## Endpoints da API REST (Backend)

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/api/health` | Healthcheck do servidor |
| `GET` | `/api/products` | Lista produtos (com filtros de busca e categoria) |
| `GET` | `/api/products/:id` | Detalhes de um produto |
| `POST` | `/api/products` | Cadastra novo produto |
| `PUT` | `/api/products/:id` | Atualiza o cadastro do produto |
| `PATCH` | `/api/products/:id/stock` | Ajuste de saldo físico (gera movimentação automática) |
| `PATCH` | `/api/products/:id/fiscal` | Atualiza NCM, ICMS e CFOP |
| `GET` | `/api/movements` | Histórico de movimentações (filtro por filial) |
| `POST` | `/api/movements` | Registra movimentação de estoque |
| `GET` | `/api/transfers` | Lista transferências entre filiais |
| `POST` | `/api/transfers` | Inicia nova transferência |
| `PATCH` | `/api/transfers/:id/complete` | Conclui transferência e dá entrada no destino |
| `GET` | `/api/invoices` | Lista notas fiscais |
| `POST` | `/api/invoices` | Emite nova NF-e ou NFC-e |
| `GET` | `/api/invoices/:id/xml` | Download do arquivo XML da nota fiscal |
| `GET` | `/api/invoices/staged` | Dados da nota pendente de importação XML |
| `POST` | `/api/invoices/staged` | Salva uma prévia XML para conferência |
| `POST` | `/api/invoices/staged/link-sku` | Vincula item do XML a SKU do estoque |
| `POST` | `/api/invoices/staged/confirm` | Confirma entrada física da nota e gera movimentação |
| `POST` | `/api/invoices/consult-key` | Consulta status de chave de acesso na SEFAZ |
