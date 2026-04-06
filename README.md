# 🏛️ Simulador de Avaliação Atricon 2026

![Status](https://img.shields.io/badge/Status-Ativo-success)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=flat&logo=vite&logoColor=FFD62E)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat&logo=firebase&logoColor=black)
![Bootstrap](https://img.shields.io/badge/Bootstrap_5-563D7C?style=flat&logo=bootstrap&logoColor=white)


Um sistema web robusto e responsivo desenvolvido para simular, gerenciar e calcular o nível de transparência pública de Prefeituras e Câmaras Municipais, com base nos critérios rigorosos do Programa Nacional de Transparência Pública (PNTP) da Atricon.

## ✨ Principais Funcionalidades

* **🔒 Autenticação e Cadastro:** Acesso restrito protegido pelo Google Firebase Authentication, com opção de cadastro seguro para novos usuários da equipe diretamente na tela de login.
* **☁️ Sincronização em Nuvem (Real-time):** Todos os dados, avaliações e notas são salvos e sincronizados instantaneamente usando o Cloud Firestore, permitindo que toda a equipe veja as mesmas informações atualizadas.
* **📊 Cálculo Automático de Selos:** O sistema calcula a porcentagem de transparência e atribui os selos oficiais (Diamante, Ouro, Prata, Elevado, Intermediário, Básico, Inicial ou Inexistente) com base em critérios *Essenciais, Obrigatórios e Recomendados*.
* **📋 Painel de Gerenciamento (Tabelas):** Visualização rápida e filtrável de todos os cadastros divididos por Prefeituras, Câmaras e Controladores (com cruzamento de dados de contato e responsáveis).
* **📱 Mobile First:** Interface 100% responsiva. Menus laterais dinâmicos e botões flutuantes adaptados para uso em campo (smartphones e tablets).
* **💾 Gestão Avançada de Dados:**
    * **JSON:** Importação e Exportação do banco de dados completo (Backup de segurança).
    * **CSV:** Exportação de relatórios gerenciais, download de **Modelos de Importação** em branco e importação em lote compatível com Excel.
* **⚙️ CRUD Completo:** Cadastro, edição, listagem e exclusão de entidades diretamente pela interface.

## 🛠️ Tecnologias Utilizadas

A arquitetura do projeto foi totalmente refatorada para garantir máxima performance e componentização:

* **Front-end:** React.js construído com Vite.
* **Estilização:** Bootstrap 5 + CSS Customizado (`index.css`) compatível com Dark Mode.
* **Back-end / Segurança:** Firebase Authentication.
* **Banco de Dados:** Cloud Firestore (NoSQL em tempo real).
* **Deploy Contínuo:** Vercel.

## 🚀 Como rodar o projeto localmente

Siga os passos abaixo para rodar o ambiente de desenvolvimento na sua máquina:

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/Tharliton777/simulador-atricon.git](https://github.com/Tharliton777/simulador-atricon.git)

2.  Acesse a pasta do projeto:
   bash
   cd simulador-atricon

3. Instale as dependências:

   bash
   npm install

4. Inicie o servidor de desenvolvimento:

   bash
   npm install