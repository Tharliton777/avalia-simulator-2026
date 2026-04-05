# 🏛️ Simulador de Avaliação Atricon 2026

![Status](https://img.shields.io/badge/Status-Ativo-success)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=flat&logo=vite&logoColor=FFD62E)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat&logo=firebase&logoColor=black)
![Bootstrap](https://img.shields.io/badge/Bootstrap_5-563D7C?style=flat&logo=bootstrap&logoColor=white)

Um sistema web robusto e responsivo desenvolvido para simular, gerenciar e calcular o nível de transparência pública de Prefeituras e Câmaras Municipais, com base nos critérios rigorosos do Programa Nacional de Transparência Pública (PNTP) da Atricon.

## ✨ Principais Funcionalidades

* **🔒 Autenticação Segura:** Acesso restrito protegido pelo cofre do Google Firebase Authentication (E-mail e Senha).
* **📊 Cálculo Automático de Selos:** O sistema calcula a porcentagem de transparência em tempo real e atribui os selos oficiais (Diamante, Ouro, Prata, Elevado, Intermediário, Básico, Inicial ou Inexistente) com base em critérios *Essenciais, Obrigatórios e Recomendados*.
* **📱 Mobile First:** Interface 100% responsiva. Menus laterais dinâmicos (Sidebar) e botões flutuantes adaptados para uso em campo (smartphones e tablets).
* **💾 Gestão Avançada de Dados (Backup & Relatórios):**
    * **JSON:** Importação e Exportação do banco de dados completo (Backup de segurança com histórico de avaliações).
    * **CSV:** Importação em lote e Exportação de relatórios gerenciais compatíveis com Excel.
* **⚙️ CRUD Completo:** Cadastro, edição, listagem e exclusão de entidades, associando operadores e controladores responsáveis.

## 🛠️ Tecnologias Utilizadas

A arquitetura do projeto foi totalmente refatorada para garantir máxima performance e componentização:

* **Front-end:** React.js construído com Vite (Substituindo a antiga arquitetura Vanilla JS).
* **Estilização:** Bootstrap 5 + CSS Customizado (`index.css`).
* **Back-end / Segurança:** Firebase Authentication.
* **Persistência de Dados Local:** `localStorage` (Mantém o progresso do usuário no navegador).
* **Deploy Contínuo:** Vercel.

## 🚀 Como rodar o projeto localmente

Siga os passos abaixo para rodar o ambiente de desenvolvimento na sua máquina:

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/SEU_USUARIO/simulador-atricon.git](https://github.com/Tharliton777/simulador-atricon.git)