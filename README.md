# 🏛️ Avalia Simulator 2026

![Interface do Simulador](.github/TelaInicioAvalia.png)

O **Avalia Simulator** é uma ferramenta interativa de alta performance desenvolvida para auxiliar municípios e órgãos públicos na simulação dos critérios de transparência estabelecidos pela **Atricon**. O sistema permite gerenciar uma base ampla de entidades, realizar checklists técnicos detalhados e visualizar o progresso em tempo real.

## 🚀 Novidades da Versão Atual
- **Carga Massiva de Dados:** Já inclui mais de 200 entidades cadastradas (Prefeituras e Câmaras Municipais).
- **Filtros Dinâmicos por Poder:** Separação visual rápida entre Poder Executivo e Legislativo com botões de estado ativo.
- **Sistema de Paginação (Lazy Loading):** Exibição inteligente de cards (25 por vez) para garantir fluidez na navegação e performance do sistema.
- **Fechamento Inteligente:** Menu lateral retrátil com fechamento por clique externo para melhor usabilidade em dispositivos móveis.

## ✨ Funcionalidades Principais

- **Gestão de Entidades:** Cadastre, edite e exclua Prefeituras ou Câmaras de forma dinâmica.
- **Checklist Inteligente:** 20 grupos de critérios técnicos. O sistema identifica automaticamente se a entidade é Câmara ou Prefeitura e ajusta os grupos exibidos (ex: Obras e Saúde para Executivo, Atividades Finalísticas para Legislativo).
- **Cálculo de Precisão:** Barra de progresso e percentual atualizados instantaneamente conforme os critérios são marcados.
- **Regra de Ouro (Criterios Essenciais):** Lógica integrada que limita o selo máximo (Prata, Ouro ou Diamante) caso itens **Essenciais (*)** possuam pendências.
- **Persistência de Dados:** Uso de `LocalStorage` para manter as avaliações salvas no navegador.
- **Gestão de Backup:** Função para exportar e importar arquivos JSON, permitindo transferir dados entre computadores com facilidade.
- **Modo Escuro (Dark Mode):** Interface moderna com suporte total a temas claro e escuro.

## 🏆 Critérios de Selos

| Percentual | Nível de Transparência |
| :--- | :--- |
| **95% a 100%** | 💎 Diamante (Requer todos os Essenciais) |
| **85% a 94%** | 🥇 Ouro (Requer todos os Essenciais) |
| **75% a 84%** | 🥈 Prata (Requer todos os Essenciais) |
| **50% a 74%** | 🔵 Intermediário |
| **30% a 49%** | ⚪ Básico |
| **1% a 29%** | 🟡 Inicial |
| **0%** | ❌ Inexistente |

> **Nota:** Se houver falha em qualquer item marcado com **(*)**, o selo máximo permitido será **Elevado**, independentemente da nota percentual alcançada.

## 🛠️ Tecnologias Utilizadas

- **HTML5 & CSS3:** Estrutura responsiva e variáveis nativas para temas dinâmicos.
- **JavaScript (Vanilla):** Lógica de negócio pura, sem dependências externas pesadas, garantindo rapidez.
- **Bootstrap 5:** Framework de UI para modais, grid system e componentes modernos.
- **Bootstrap Icons:** Biblioteca de ícones vetoriais.

## 📋 Como usar

1. **Acesso:** Utilize a senha padrão `assesi2026` para entrar no sistema.
2. **Filtros:** Use os botões de topo para filtrar entre "Executivo" ou "Legislativo" e localize sua entidade através da barra de busca.
3. **Avaliação:** Clique em "Avaliar" e preencha as opções **D** (Disponibilidade), **A** (Atualidade) e **S** (Série Histórica).
4. **Backup:** Exporte seus dados regularmente pelo menu lateral para garantir a segurança das informações.
5. **Relatórios:** Dentro de uma avaliação, clique em "Imprimir Relatório" para gerar um documento formatado.

## 🔗 Link do Projeto
Acesse o simulador online: [https://tharliton777.github.io/avalia-simulator-2026/](https://tharliton777.github.io/avalia-simulator-2026/)

## 💾 Instalação Local

```bash
# Clone o repositório
git clone [https://github.com/tharliton777/avalia-simulator-2026.git](https://github.com/tharliton777/avalia-simulator-2026.git)

# Acesse a pasta
cd avalia-simulator-2026

# Abra o arquivo index.html no seu navegador favorito
