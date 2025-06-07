
---

# Odonto-Legal Forense – Plataforma Completa

![Badge de Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow)
![Badge de Licença](https://img.shields.io/badge/Licença-MIT-green)
![Badge React Native](https://img.shields.io/badge/Frontend-React_Native-61DAFB?logo=react)
![Badge Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=nodedotjs)
![Badge Flask](https://img.shields.io/badge/IA_Backend-Flask-000000?logo=flask)

Este repositório contém a plataforma completa do projeto **Odonto-Legal Forense**, uma solução multiplataforma desenvolvida para otimizar e digitalizar os processos de perícia em odontologia legal. O projeto é composto por um aplicativo mobile nativo e dois serviços de backend.

## 🎯 Missão do Projeto

Desenvolver uma plataforma digital robusta para auxiliar o trabalho de profissionais da área de Odontologia Legal e Forense, promovendo uma interface móvel intuitiva, gerenciamento de dados centralizado e a aplicação de inteligência artificial para auxiliar em análises complexas.

## ✨ Funcionalidades Principais

*   **Gerenciamento de Casos:** Crie, edite e acompanhe o andamento de casos periciais.
*   **Controle de Acesso por Papel (RBAC):** Níveis de permissão distintos para Administradores, Peritos e Assistentes.
*   **Dashboard Analítico:** Visualize estatísticas gerais sobre casos, vítimas, usuários e atividades do sistema.
*   **Gerenciamento de Evidências:** Adicione, edite e anexe evidências textuais e fotográficas, com georreferenciamento automático.
*   **Odontograma Digital:** Crie e gerencie odontogramas detalhados (Post-Mortem e Ante-Mortem) para identificação humana.
*   **Análise com IA:** Utilize um serviço de IA para resumir evidências, gerar hipóteses e auxiliar em análises forenses.

## ⚙️ Arquitetura e Tecnologias

A plataforma é construída sobre uma arquitetura de microsserviços, garantindo escalabilidade e separação de responsabilidades.

### 📱 **Frontend: Aplicativo Mobile (React Native)**
O aplicativo nativo para iOS e Android é a principal interface para os usuários em campo.
*   **Framework:** **React Native (com Expo)**
*   **UI Toolkit:** **React Native Paper** - Para componentes Material Design.
*   **Navegação:** **React Navigation** (Stack, Bottom Tabs, Material Top Tabs).
*   **Recursos Nativos:** **Expo Location**, **Expo Image Picker**, **React Native Maps**.

### ☁️ **Backend Principal (Node.js)**
O servidor principal que lida com a lógica de negócios, gerenciamento de dados e autenticação.
*   **Ambiente:** **Node.js**
*   **Framework:** **Express.js**
*   **Banco de Dados:** **MongoDB** com **Mongoose** para modelagem de dados.
*   **Autenticação:** **JSON Web Tokens (JWT)**.

### 🧠 **Backend de IA (Python/Flask)**
Um microsserviço dedicado a processar tarefas de inteligência artificial e machine learning.
*   **Framework:** **Flask**
*   **Machine Learning:** Bibliotecas como **Scikit-learn** e **Pandas**.
*   **Funcionalidade:** Expõe endpoints para tarefas como predição, sumarização e análise de importância de features.

## 📁 Estrutura do Projeto (Monorepo)

```
odonto-legal-plataforma/
├── odonto-legal-app/        # Aplicativo mobile em React Native (Expo)
│   ├── assets/              # Imagens e fontes
│   ├── components/          # Componentes reutilizáveis (Cards, Modais, etc.)
│   ├── navigators/          # Navegadores (Tab, Stack)
│   ├── screens/             # Telas de Perito/Assistente
│   ├── screensAdm/          # Telas de Administrador
│   ├── utils/               # Funções auxiliares (ex: exportação)
│   └── App.js               # Ponto de entrada da navegação
│
├── odonto-legal-backend/    # Backend principal em Node.js
│   ├── controllers/         # Lógica das rotas
│   ├── models/              # Schemas do Mongoose
│   ├── routes/              # Definição dos endpoints da API
│   └── server.js            # Ponto de entrada do servidor
│
└── odonto-legal-ia/         # Microsserviço de IA em Flask
    ├── models/              # Modelos de machine learning salvos (.pkl)
    └── app.py               # Ponto de entrada da API Flask
```

## 🚀 Como Executar Localmente

Certifique-se de ter o Node.js, Python e as ferramentas de desenvolvimento do React Native (Expo Go no seu celular ou simulador) instalados, ou apenas use o Expo Go já que o backend está na nuvem.

### 1. Aplicativo Mobile (React Native)

```bash
# Navegue até a pasta do aplicativo
cd odonto-legal-app

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento do Expo
npx expo start
```
Após iniciar, escaneie o QR code com o aplicativo **Expo Go** no seu celular ou execute em um simulador (pressionando `a` para Android ou `i` para iOS no terminal).

## 👥 Contribuidores

*   Richard
*   Morgana
*   Eduardo
*   Hadassa
*   Cauã

## 📌 Observações

*   O projeto está em desenvolvimento ativo.
*   As URLs das APIs no código do frontend podem precisar ser ajustadas para o seu ambiente local (ex: `http://localhost:5000` em vez da URL de produção).
*   Sugestões de melhorias e contribuições são muito bem-vindas!

## 📄 Licença

Este projeto está sob a Licença MIT.
