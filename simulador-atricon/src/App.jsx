import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore"; 
import { auth, db } from './firebase'; 
import './index.css';

// ============================================================================
// 1. DADOS ORIGINAIS
// ============================================================================
const GRUPOS_CRITERIOS = [
    {
        titulo: "1. Informações Prioritárias", pesoDimensao: 2,
        itens: [
            { id: "1.1", nome: "Possui sítio oficial próprio na internet?", classificacao: "essencial", exige: ['g'] },
            { id: "1.2", nome: "Possui portal da transparência próprio ou compartilhado na internet?", classificacao: "essencial", exige: ['g'] },
            { id: "1.3", nome: "O acesso ao portal transparência está visível na capa do site?", classificacao: "obrigatoria", exige: ['g'] },
            { id: "1.4", nome: "O site e o portal de transparência contêm ferramenta de pesquisa de conteúdo que permita o acesso à informação?", classificacao: "obrigatoria", exige: ['g'] }
        ]
    },
    {
        titulo: "2. Informações Institucionais", pesoDimensao: 2,
        itens: [
            { id: "2.1", nome: "Divulga a sua estrutura organizacional e a norma que a institui/altera?", classificacao: "obrigatoria", exige: ['g'] },
            { id: "2.2", nome: "Divulga competências e/ou atribuições?", classificacao: "obrigatoria", exige: ['g'] },
            { id: "2.3", nome: "Identifica o nome dos atuais responsáveis pela gestão do Poder/Órgão?", classificacao: "obrigatoria", exige: ['g'] },
            { id: "2.4", nome: "Divulga os endereços e telefones atuais do Poder ou órgão e e-mails institucionais?", classificacao: "obrigatoria", exige: ['g'] },
            { id: "2.5", nome: "Divulga o horário de atendimento?", classificacao: "obrigatoria", exige: ['g'] },
            { id: "2.6", nome: "Divulga os atos normativos próprios?", classificacao: "obrigatoria", exige: ['g', 's', 'a'] },
            { id: "2.7", nome: "Divulga as perguntas e respostas mais frequentes relacionadas às atividades desenvolvidas?", classificacao: "obrigatoria", exige: ['g'] },
            { id: "2.8", nome: "Participa em redes sociais e apresenta link de acesso ao seu perfil?", classificacao: "recomendada", exige: ['g'] },
            { id: "2.9", nome: "Inclui botão do Radar da Transparência Pública no site ou portal?", classificacao: "recomendada", exige: ['g'] }
        ]
    },
    {
        titulo: "3. Receitas", pesoDimensao: 4,
        itens: [
            { id: "3.1", nome: "Divulga as receitas do Poder ou órgão, evidenciando sua previsão e realização?", classificacao: "essencial", exige: ['g', 's', 'a'] },
            { id: "3.2", nome: "Divulga a classification orçamentária por natureza da receita?", classificacao: "essencial", exige: ['g', 's', 'a'] },
            { id: "3.3", nome: "Divulga a lista dos inscritos em dívida ativa?", classificacao: "obrigatoria", exige: ['g', 's', 'a'] }
        ]
    },
    {
        titulo: "4. Despesas", pesoDimensao: 4,
        itens: [
            { id: "4.1", nome: "Divulga o total das despesas empenhadas, liquidadas e pagas?", classificacao: "essencial", exige: ['g', 's', 'a'] },
            { id: "4.2", nome: "Divulga as despesas por classification orçamentária?", classificacao: "essencial", exige: ['g', 's', 'a'] },
            { id: "4.3", nome: "Possibilita a consulta de empenhos com detalhes do beneficiário, valor, objeto e licitação originária?", classificacao: "essencial", exige: ['g', 's', 'a'] },
            { id: "4.4", nome: "Publica relação das despesas com aquisições de bens efetuadas pela instituição contendo: identificação do bem, preço unitário, quantidade, nome do fornecedor e valor total de cada aquisição?", classificacao: "recomendada", exige: ['g', 's', 'a'] },
            { id: "4.5", nome: "Publica informações sobre despesas de patrocínio?", classificacao: "recomendada", exige: ['g', 's', 'a'] },
            { id: "4.6", nome: "Publica informações detalhadas sobre a execution dos contratos de publicidade, com nomes dos fornecedores de serviços especializados e veículos, bem como informações sobre os totais de valores pagos para cada tipo de serviço e meio de divulgação?", classificacao: "recomendada", exige: ['g', 's', 'a'] }
        ]
    },
    {
        titulo: "5. Convênios e Transferências", pesoDimensao: 1,
        itens: [
            { id: "5.1", nome: "Divulga as transferências recebidas (convênios/acordos)?", classificacao: "obrigatoria", exige: ['g', 's', 'a'] },
            { id: "5.2", nome: "Divulga as transferências realizadas (convênios/acordos)?", classificacao: "obrigatoria", exige: ['g', 's', 'a'] },
            { id: "5.3", nome: "Divulga os acordos firmados que não envolvam transferência de recursos financeiros?", classificacao: "obrigatoria", exige: ['g', 's', 'a'] }
        ]
    },
    {
        titulo: "6. Recursos Humanos", pesoDimensao: 3,
        itens: [
            { id: "6.1", nome: "Divulga a relação nominal dos servidores/autoridades/membros, seus cargos, lotações e horários?", classificacao: "obrigatoria", exige: ['g', 's', 'a'] },
            { id: "6.2", nome: "Divulga a remuneração nominal de cada servidor/autoridade/Membro?", classificacao: "obrigatoria", exige: ['g', 's', 'a'] },
            { id: "6.3", nome: "Divulga a tabela com o padrão remuneratório dos cargos e funções?", classificacao: "obrigatoria", exige: ['g', 's'] },
            { id: "6.4", nome: "Divulga a lista de seus estagiários (nome, datas de contratação e término)?", classificacao: "recomendada", exige: ['g', 's', 'a'] },
            { id: "6.5", nome: "Publica lista dos terceirizados (nome, função e empresa empregadora)?", classificacao: "recomendada", exige: ['g', 's', 'a'] },
            { id: "6.6", nome: "Divulga a íntegra dos editais de concursos e seleções públicas?", classificacao: "obrigatoria", exige: ['g', 's', 'a'] },
            { id: "6.7", nome: "Divulga informações sobre os demais atos dos concursos públicos e processos seletivos do Poder ou órgão, contendo no mínimo a lista de aprovados com as classificações e as nomeações?", classificacao: "obrigatoria", exige: ['g', 's'] }
        ]
    },
    {
        titulo: "7. Diárias", pesoDimensao: 1,
        itens: [
            { id: "7.1", nome: "Divulga nome, cargo, valor, período, motivo e destino do afastamento?", classificacao: "obrigatoria", exige: ['g', 's', 'a'] },
            { id: "7.2", nome: "Divulga tabela com os valores das diárias?", classificacao: "obrigatoria", exige: ['g', 's', 'a'] }
        ]
    },
    {
        titulo: "8. Licitações", pesoDimensao: 3,
        itens: [
            { id: "8.1", nome: "Divulga a relação das licitações (número, modalidade, objeto, data, valor e situação)?", classificacao: "obrigatoria", exige: ['g', 's', 'a'] },
            { id: "8.2", nome: "Divulga a íntegra dos editais de licitação?", classificacao: "obrigatoria", exige: ['g', 's', 'a'] },
            { id: "8.3", nome: "Divulga a íntegra dos demais documentos das fases interna e externa?", classificacao: "obrigatoria", exige: ['g', 's', 'a'] },
            { id: "8.4", nome: "Divulga a íntegra dos principais documentos dos processes de dispensa e inexigibilidade?", classificacao: "obrigatoria", exige: ['g', 's', 'a'] },
            { id: "8.5", nome: "Divulga a íntegra das Atas de Adesão – SRP?", classificacao: "obrigatoria", exige: ['g', 's', 'a'] },
            { id: "8.6", nome: "Divulga o plano de contratações anual?", classificacao: "recomendada", exige: ['g', 's'] },
            { id: "8.7", nome: "Divulga a relação dos licitantes e/ou contratados sancionados?", classificacao: "recomendada", exige: ['g', 's', 'a'] },
            { id: "8.8", nome: "Divulga regulamento interno de licitações e contratos?", classificacao: "obrigatoria", exige: ['g'] }
        ]
    },
    {
        titulo: "9. Contratos", pesoDimensao: 3,
        itens: [
            { id: "9.1", nome: "Divulga a relação dos contratos celebrados com resumo e aditivos?", classificacao: "obrigatoria", exige: ['g', 's', 'a'] },
            { id: "9.2", nome: "Divulga o inteiro teor dos contratos e aditivos?", classificacao: "obrigatoria", exige: ['g', 's', 'a'] },
            { id: "9.3", nome: "Divulga a relação/lista dos fiscais de cada contrato?", classificacao: "obrigatoria", exige: ['g', 's', 'a'] },
            { id: "9.4", nome: "Divulga a ordem cronológica de seus pagamentos?", classificacao: "obrigatoria", exige: ['g', 's', 'a'] }
        ]
    },
    {
        titulo: "10. Obras", pesoDimensao: 2,
        itens: [
            { id: "10.1", nome: "Divulga informações sobre as obras (objeto, situation, datas, empresa e percentual)?", classificacao: "recomendada", exige: ['g', 's'] },
            { id: "10.2", nome: "Divulga os quantitativos, preços unitários e totais contratados?", classificacao: "obrigatoria", exige: ['g', 's'] },
            { id: "10.3", nome: "Divulga os quantitativos executados e preços efetivamente pagos?", classificacao: "obrigatoria", exige: ['g', 's'] },
            { id: "10.4", nome: "Divulga a relação das obras paralisadas?", classificacao: "obrigatoria", exige: ['g', 's'] }
        ]
    },
    {
        titulo: "11. Planejamento e Prestação de contas", pesoDimensao: 4,
        itens: [
            { id: "11.1", nome: "Publica a Prestação de Contas do Ano Anterior (Balanço Geral)?", classificacao: "obrigatoria", exige: ['g', 's', 'a'] },
            { id: "11.2", nome: "Divulga o Relatório de Gestão ou Atividades?", classificacao: "obrigatoria", exige: ['g', 's', 'a'] },
            { id: "11.3", nome: "Divulga a íntegra da decisão do julgamento das contas pelo TC?", classificacao: "obrigatoria", exige: ['g', 's', 'a'] },
            { id: "11.4", nome: "Divulga o resultado do julgamento das Contas do Executivo pelo Legislativo?", classificacao: "obrigatoria", exige: ['g', 's', 'a'] },
            { id: "11.5", nome: "Divulga o Relatório de Gestão Fiscal (RGF)?", classificacao: "essencial", exige: ['g', 's', 'a'] },
            { id: "11.6", nome: "Divulga o Relatório Resumido da Execução Orçamentária (RREO)?", classificacao: "essencial", exige: ['g', 's', 'a'] },
            { id: "11.7", nome: "Divulga o plano estratégico institucional?", classificacao: "recomendada", exige: ['g'] },
            { id: "11.8", nome: "Divulga a Lei do Plano Plurianual (PPA) e anexos?", classificacao: "essencial", exige: ['g'] },
            { id: "11.9", nome: "Divulga a Lei de Diretrizes Orçamentárias (LDO) e anexos?", classificacao: "essencial", exige: ['g'] },
            { id: "11.10", nome: "Divulga a Lei Orçamentária (LOA) e anexos?", classificacao: "essencial", exige: ['g'] },
            { id: "11.11", nome: "Divulga o Orçamento do Consórcio Público onde conste a estimativa da receita e a fixação da despesa para o exercício atual?", classificacao: "obrigatoria", exige: ['g', 's', 'a'] },
            { id: "11.12", nome: "Divulga as demonstrações financeiras trimestrais?", classificacao: "obrigatoria", exige: ['g', 's', 'a'] },
            { id: "11.13", nome: "Divulga as demonstrações financeiras (contábeis) acompanhadas dos pareceres do Conselho Fiscal e da auditoria independente?", classificacao: "obrigatoria", exige: ['g', 's', 'a'] },
            { id: "11.14", nome: "Pública o Orçamento de Investimentos da instituição que compõe a Lei Orçamentária Anual?", classificacao: "obrigatoria", exige: ['g', 's', 'a'] },
            { id: "11.15", nome: "Divulga as demonstrações contábeis auditadas em formato eletrônico editável?", classificacao: "obrigatoria", exige: ['g', 's', 'a'] },
            { id: "11.16", nome: "Divulga o relatório anual elaborado pelo Comitê de Auditoria Estatutário com informações sobre as atividades e os resultados e suas conclusões e recomendações?", classificacao: "obrigatoria", exige: ['g', 's', 'a'] },
            { id: "11.17", nome: "Divulga as atas das reuniões do Comitê de Auditoria Estatutário?", classificacao: "obrigatoria", exige: ['g', 's', 'a'] },
            { id: "11.18", nome: "Divulga as atas das reuniões do Comitê de Elegibilidade Estatutário ou Comitê de Pessoas, Elegibilidade, Sucessão e Remuneração a partir de 2022, na forma de sumário dos fatos ocorridos, inclusive das dissidências e protestos?", classificacao: "obrigatoria", exige: ['g', 's', 'a'] },
            { id: "11.19", nome: "Divulga anualmente relatório integrado ou de sustentabilidade?", classificacao: "obrigatoria", exige: ['g', 's', 'a'] }
        ]
    },
    {
        titulo: "12. Serviço de Informação ao Cidadão - SIC", pesoDimensao: 2,
        itens: [
            { id: "12.1", nome: "Existe o SIC no site e indica a unidade/setor responsável?", classificacao: "obrigatoria", exige: ['g'] },
            { id: "12.2", nome: "Indica endereço, telefone, e-mail e horário do SIC?", classificacao: "obrigatoria", exige: ['g'] },
            { id: "12.3", nome: "Há possibilidade de envio de pedidos de forma eletrônica (e-SIC)?", classificacao: "obrigatoria", exige: ['g'] },
            { id: "12.4", nome: "A solicitação por meio de e-SIC é simple?", classificacao: "obrigatoria", exige: ['g'] },
            { id: "12.5", nome: "Divulga instrumento normativo local que regulamente a LAI?", classificacao: "obrigatoria", exige: ['g'] },
            { id: "12.6", nome: "Divulga prazos de resposta e autoridades competentes?", classificacao: "recomendada", exige: ['g'] },
            { id: "12.7", nome: "Divulga relatório anual estatístico?", classificacao: "obrigatoria", exige: ['g', 's', 'a'] },
            { id: "12.8", nome: "Divulga lista de documentos classificados em cada grau de sigilo?", classificacao: "obrigatoria", exige: ['g', 's', 'a'] },
            { id: "12.9", nome: "Divulga lista das informações desclassificadas nos últimos 12 meses?", classificacao: "obrigatoria", exige: ['g', 's', 'a'] }
        ]
    },
    {
        titulo: "13. Acessibilidade", pesoDimensao: 1,
        itens: [
            { id: "13.1", nome: "O site e o portal contêm símbolo de acessibilidade em destaque?", classificacao: "obrigatoria", exige: ['g'] },
            { id: "13.2", nome: "Contêm exibição do caminho de páginas (breadcrumb)?", classificacao: "obrigatoria", exige: ['g'] },
            { id: "13.3", nome: "Contêm opção de alto contraste?", classificacao: "obrigatoria", exige: ['g'] },
            { id: "13.4", nome: "Contêm ferramenta de redimensionamento de texto?", classificacao: "obrigatoria", exige: ['g'] },
            { id: "13.5", nome: "Contêm mapa do site institucional?", classificacao: "recomendada", exige: ['g'] }
        ]
    },
    {
        titulo: "14. Ouvidorias", pesoDimensao: 1,
        itens: [
            { id: "14.1", nome: "Há informações sobre o atendimento presencial pela Ouvidoria?", classificacao: "obrigatoria", exige: ['g'] },
            { id: "14.2", nome: "Há canal eletrônico de acesso/interação com a ouvidoria?", classificacao: "obrigatoria", exige: ['g'] },
            { id: "14.3", nome: "Divulga Carta de Serviços ao Usuário?", classificacao: "obrigatoria", exige: ['g'] }
        ]
    },
    {
        titulo: "15. Lei Geral de Proteção de Dados (LGPD) e Governo Digital", pesoDimensao: 1,
        itens: [
            { id: "15.1", nome: "Identifica o encarregado pelo tratamento de dados pessoais?", classificacao: "obrigatoria", exige: ['g'] },
            { id: "15.2", nome: "Publica a sua Política de Privacidade e Proteção de Dados?", classificacao: "recomendada", exige: ['g'] },
            { id: "15.3", nome: "Possibilita o acesso a serviços públicos por meio digital?", classificacao: "obrigatoria", exige: ['g'] },
            { id: "15.4", nome: "Possibilita o acesso automatizado em dados abertos?", classificacao: "obrigatoria", exige: ['g'] },
            { id: "15.5", nome: "Regulamenta a Lei do Governo Digital?", classificacao: "recomendada", exige: ['g'] },
            { id: "15.6", nome: "Realiza e divulga resultados de pesquisas de satisfação?", classificacao: "obrigatoria", exige: ['g'] }
        ]
    },
    {
        titulo: "16. Renúncias de Receitas", pesoDimensao: 1,
        itens: [
            { id: "16.1", nome: "Divulga as desonerações tributárias concedidas?", classificacao: "obrigatoria", exige: ['g'] },
            { id: "16.2", nome: "Divulga os valores da renúncia fiscal prevista e realizada?", classificacao: "obrigatoria", exige: ['g', 's', 'a'] },
            { id: "16.3", nome: "Identifica os beneficiários das desonerações tributárias?", classificacao: "recomendada", exige: ['g', 's', 'a'] },
            { id: "16.4", nome: "Divulga informações sobre projects de incentivo à cultura e esportes?", classificacao: "recomendada", exige: ['g', 's', 'a'] }
        ]
    },
    {
        titulo: "17. Emendas Parlamentares", pesoDimensao: 1,
        itens: [
            { id: "17.1", nome: "Identifica as emendas parlamentares federais recebidas?", classificacao: "obrigatoria", exige: ['g', 's', 'a'] },
            { id: "17.2", nome: "Identifica as emendas parlamentares estaduais e municipais?", classificacao: "obrigatoria", exige: ['g', 's', 'a'] },
            { id: "17.3", nome: "Demonstra a execução orçamentária e financeira oriunda das emendas parlamentares recebidas e próprias?", classificacao: "obrigatoria", exige: ['g', 's', 'a'] }
        ]
    },
    {
        titulo: "18. Saúde", pesoDimensao: 1,
        itens: [
            { id: "18.1", nome: "Divulga o plano de saúde, a programação anual e o relatório de gestão?", classificacao: "obrigatoria", exige: ['g', 's', 'a'] },
            { id: "18.2", nome: "Divulga informações relacionadas aos serviços de saúde?", classificacao: "obrigatoria", exige: ['g', 's'] },
            { id: "18.3", nome: "Divulga a lista de espera de regulação para acesso às consultas?", classificacao: "recomendada", exige: ['g'] },
            { id: "18.4", nome: "Divulga lista dos medicamentos do SUS e como obtê-los?", classificacao: "recomendada", exige: ['g', 's'] },
            { id: "18.5", nome: "Divulga os estoques de medicamentos das farmácias públicas?", classificacao: "obrigatoria", exige: ['g', 's'] },
            { id: "18.6", nome: "Divulga informações atualizadas sobre a composição e o funcionamento do Conselho de Saúde?", classificacao: "recomendada", exige: ['g'] }
        ]
    },
    {
        titulo: "19. Educação e Assistência Social", pesoDimensao: 1,
        itens: [
            { id: "19.1", nome: "Divulga o plano de educação e o respectivo relatório de resultados?", classificacao: "recomendada", exige: ['g', 's', 'a'] },
            { id: "19.2", nome: "Divulga a lista de espera em creches públicas?", classificacao: "obrigatoria", exige: ['g', 's'] },
            { id: "19.3", nome: "Divulga informações atualizadas sobre a composição e o funcionamento do Conselho do Fundeb?", classificacao: "obrigatoria", exige: ['g'] },
            { id: "19.4", nome: "Divulga informações atualizadas sobre a composição e o funcionamento do Conselho de Assistência Social?", classificacao: "recomendada", exige: ['g'] }
        ]
    },
    {
        titulo: "20. Atividades Finalísticas - Poder Legislativo", pesoDimensao: 3,
        itens: [
            { id: "20.1", nome: "Divulga a composição da Casa, com a biografia dos parlamentares?", classificacao: "obrigatoria", exige: ['g'] },
            { id: "20.2", nome: "Divulga as leis e atos infralegais produzidos?", classificacao: "obrigatoria", exige: ['g', 's', 'a'] },
            { id: "20.3", nome: "Divulga projects de leis e as respectivas tramitações?", classificacao: "obrigatoria", exige: ['g', 's', 'a'] },
            { id: "20.4", nome: "Divulga a pauta das sessões do Plenário?", classificacao: "obrigatoria", exige: ['g', 's'] },
            { id: "20.5", nome: "Divulga a pauta das Comissões?", classificacao: "obrigatoria", exige: ['g', 's'] },
            { id: "20.6", nome: "Divulga as atas das sessões e lista de presença?", classificacao: "obrigatoria", exige: ['g', 's', 'a'] },
            { id: "20.7", nome: "Divulga lista sobre as votações nominais?", classificacao: "recomendada", exige: ['g', 's', 'a'] },
            { id: "20.8", nome: "Divulga o ato que aprecia as Contas do Chefe do Executivo?", classificacao: "obrigatoria", exige: ['g', 's', 'a'] },
            { id: "20.9", nome: "Há transmissão de sessões ou outras formas de participação popular?", classificacao: "recomendada", exige: ['g'] },
            { id: "20.10", nome: "Divulga valores relativos às cotas para exercício da atividade parlamentar?", classificacao: "recomendada", exige: ['g', 's', 'a'] },
            { id: "20.11", nome: "Divulga dados sobre as atividades legislativas dos parlamentares?", classificacao: "recomendada", exige: ['g', 's', 'a'] }
        ]
    }
];

const DATA_ENTIDADES = [
    {"n": "PREFEITURA MUNICIPAL DE MAURITI", "o": "CLEYDIR"}, {"n": "PREFEITURA MUNICIPAL DE AMONTADA", "o": "CLEYDIR"}, {"n": "PREFEITURA MUNICIPAL DE CAMPOS SALES", "o": "CLEYDIR"}, {"n": "PREFEITURA MUNICIPAL DE SÃO BENEDITO", "o": "CLEYDIR"}, {"n": "PREFEITURA MUNICIPAL DE REDENÇÃO", "o": "CLEYDIR"}, {"n": "PREFEITURA MUNICIPAL DE PENTECOSTE", "o": "CLEYDIR"}, {"n": "PREFEITURA MUNICIPAL DE CRATEÚS", "o": "CLEYDIR"}, {"n": "PREFEITURA MUNICIPAL DE CASCAVEL", "o": "CLEYDIR"}, {"n": "PREFEITURA MUNICIPAL DE PEDRA BRANCA", "o": "CLEYDIR"}, {"n": "PREFEITURA MUNICIPAL DE MILHÃ", "o": "CLEYDIR"}, {"n": "PREFEITURA MUNICIPAL DE MADALENA", "o": "CLEYDIR"}, {"n": "PREFEITURA MUNICIPAL DE VIÇOSA DO CEARÁ", "o": "CLEYDIR"}, {"n": "PREFEITURA MUNICIPAL DE MONSENHOR TABOSA", "o": "CLEYDIR"}, {"n": "PREFEITURA MUNICIPAL DE SABOEIRO", "o": "CLEYDIR"}, {"n": "PREFEITURA MUNICIPAL DE MARTINÓPOLE", "o": "CLEYDIR"}, {"n": "PREFEITURA MUNICIPAL DE JIJOCA DE JERICOACOARA", "o": "CLEYDIR"}, {"n": "PREFEITURA MUNICIPAL DE HIDROLÂNDIA", "o": "CLEYDIR"}, {"n": "PREFEITURA MUNICIPAL DE GRANJEIRO", "o": "CLEYDIR"}, {"n": "PREFEITURA MUNICIPAL DE CARIDADE", "o": "CLEYDIR"}, {"n": "PREFEITURA MUNICIPAL DE CHORÓ", "o": "CLEYDIR"}, {"n": "PREFEITURA MUNICIPAL DE CAPISTRANO", "o": "CLEYDIR"}, {"n": "PREFEITURA MUNICIPAL DE BEBERIBE", "o": "CLEYDIR"}, {"n": "PREFEITURA MUNICIPAL DE APUIARÉS", "o": "CLEYDIR"}, {"n": "PREFEITURA MUNICIPAL DE IPAUMIRIM", "o": "DAVI"}, {"n": "PREFEITURA MUNICIPAL DE GUAIÚBA", "o": "DAVI"}, {"n": "PREFEITURA MUNICIPAL DE GENERAL SAMPAIO", "o": "DAVI"}, {"n": "PREFEITURA MUNICIPAL DE IPUEIRAS", "o": "DAVI"}, {"n": "PREFEITURA MUNICIPAL DE PALMÁCIA", "o": "DAVI"}, {"n": "PREFEITURA MUNICIPAL DE ITATIRA", "o": "DAVI"}, {"n": "PREFEITURA MUNICIPAL DE IPAPORANGA", "o": "DAVI"}, {"n": "PREFEITURA MUNICIPAL DE IBIAPINA", "o": "DAVI"}, {"n": "PREFEITURA MUNICIPAL DE ACARAPE", "o": "DAVI"}, {"n": "PREFEITURA MUNICIPAL DE IPU", "o": "DAVI"}, {"n": "PREFEITURA MUNICIPAL DE SÃO GONÇALO DO AMARANTE", "o": "DAVI"}, {"n": "PREFEITURA MUNICIPAL DE PARACURU", "o": "DAVI"}, {"n": "PREFEITURA MUNICIPAL DE IBICUITINGA", "o": "DAVI"}, {"n": "PREFEITURA MUNICIPAL DE AQUIRAZ", "o": "DAVI"}, {"n": "PREFEITURA MUNICIPAL DE QUIXELÔ", "o": "DAVI"}, {"n": "PREFEITURA MUNICIPAL DE ICÓ", "o": "DAVI"}, {"n": "PREFEITURA MUNICIPAL DE CAUCAIA", "o": "DAVI"}, {"n": "PREFEITURA MUNICIPAL DE SÃO JOÃO DO JAGUARIBE", "o": "DAVI"}, {"n": "PREFEITURA MUNICIPAL DE QUITERIANÓPOLIS", "o": "DAVI"}, {"n": "PREFEITURA MUNICIPAL DE PARAIPABA", "o": "DAVI"}, {"n": "PREFEITURA MUNICIPAL DE MERUOCA", "o": "DAVI"}, {"n": "PREFEITURA MUNICIPAL DE URUOCA", "o": "DAVI"}, {"n": "PREFEITURA MUNICIPAL DE PACAJUS", "o": "DAVI"}, {"n": "PREFEITURA MUNICIPAL DE SALITRE", "o": "DAVI"}, {"n": "PREFEITURA MUNICIPAL DE SANTANA DO ACARAÚ", "o": "DAVI"}, {"n": "PREFEITURA MUNICIPAL DE CEDRO", "o": "DAVI"}, {"n": "PREFEITURA MUNICIPAL DE ERERE", "o": "FELIPE"}, {"n": "PREFEITURA MUNICIPAL DE GUARAMIRANGA", "o": "FELIPE"}, {"n": "PREFEITURA MUNICIPAL DE BATURITÉ", "o": "FELIPE"}, {"n": "PREFEITURA MUNICIPAL DE COREAÚ", "o": "FELIPE"}, {"n": "PREFEITURA MUNICIPAL DE IRACEMA", "o": "FELIPE"}, {"n": "PREFEITURA MUNICIPAL DE ORÓS", "o": "FELIPE"}, {"n": "PREFEITURA MUNICIPAL DE IRAUÇUBA", "o": "FELIPE"}, {"n": "PREFEITURA MUNICIPAL DE ACARAÚ", "o": "FELIPE"}, {"n": "PREFEITURA MUNICIPAL DE SENADOR POMPEU", "o": "FELIPE"}, {"n": "PREFEITURA MUNICIPAL DE ITAIÇABA", "o": "FELIPE"}, {"n": "PREFEITURA MUNICIPAL DE EUSÉBIO", "o": "FELIPE"}, {"n": "PREFEITURA MUNICIPAL DE UMARI", "o": "FELIPE"}, {"n": "PREFEITURA MUNICIPAL DE UBAJARA", "o": "FELIPE"}, {"n": "PREFEITURA MUNICIPAL DE ACOPIARA", "o": "FELIPE"}, {"n": "PREFEITURA MUNICIPAL DE VARZEA ALEGRE", "o": "FELIPE"}, {"n": "PREFEITURA MUNICIPAL DE TAUÁ", "o": "FELIPE"}, {"n": "PREFEITURA MUNICIPAL DE RUSSAS", "o": "FELIPE"}, {"n": "PREFEITURA MUNICIPAL DE TRAIRI", "o": "FELIPE"}, {"n": "PREFEITURA MUNICIPAL DE TAMBORIL", "o": "FELIPE"}, {"n": "PREFEITURA MUNICIPAL DE MOMBAÇA", "o": "FELIPE"}, {"n": "PREFEITURA MUNICIPAL DE JARDIM", "o": "FELIPE"}, {"n": "PREFEITURA MUNICIPAL DE DEP. IRAPUAN PINHEIRO", "o": "FELIPE"}, {"n": "PREFEITURA MUNICIPAL DE URUBURETAMA", "o": "FELIPE"}, {"n": "PREFEITURA MUNICIPAL DE LAVRAS DA MANGABEIRA", "o": "FELIPE"}, {"n": "PREFEITURA MUNICIPAL DE FRECHEIRINHA", "o": "FELIPE"}, {"n": "PREFEITURA MUNICIPAL DE BAIXIO", "o": "FELIPE"}, {"n": "PREFEITURA MUNICIPAL DE CRATO", "o": "JOÃO"}, {"n": "PREFEITURA MUNICIPAL DE QUIXERAMOBIM", "o": "JOÃO"}, {"n": "SECRETARIA DE EDUCACAO DE JAGUARETAMA", "o": "JOÃO"}, {"n": "PREFEITURA MUNICIPAL DE ITAPIUNA", "o": "JOÃO"}, {"n": "PREFEITURA MUNICIPAL DE MORRINHOS", "o": "JOÃO"}, {"n": "PREFEITURA MUNICIPAL DE ARACATI", "o": "JOÃO"}, {"n": "PREFEITURA MUNICIPAL DE VARJOTA", "o": "JOÃO"}, {"n": "PREFEITURA MUNICIPAL DE OCARA", "o": "JOÃO"}, {"n": "PREFEITURA MUNICIPAL DE MASSAPÊ", "o": "JOÃO"}, {"n": "PREFEITURA MUNICIPAL DE LIMOEIRO DO NORTE", "o": "JOÃO"}, {"n": "PREFEITURA MUNICIPAL DE ALTANEIRA", "o": "JOÃO"}, {"n": "PREFEITURA MUNICIPAL DE GRAÇA", "o": "JOÃO"}, {"n": "PREFEITURA MUNICIPAL DE PARAMOTI", "o": "JOÃO"}, {"n": "PREFEITURA MUNICIPAL DE MORADA NOVA", "o": "JOÃO"}, {"n": "PREFEITURA MUNICIPAL DE HORIZONTE", "o": "JOÃO"}, {"n": "PREFEITURA MUNICIPAL DE GRANJA", "o": "JOÃO"}, {"n": "PREFEITURA MUNICIPAL DE FORQUILHA", "o": "JOÃO"}, {"n": "PREFEITURA MUNICIPAL DE PINDORETAMA", "o": "JOÃO"}, {"n": "PREFEITURA MUNICIPAL DE NOVA RUSSAS", "o": "JOÃO"}, {"n": "PREFEITURA MUNICIPAL DE ITAPAJÉ", "o": "JOÃO"}, {"n": "PREFEITURA MUNICIPAL DE TURURU", "o": "JOÃO"}, {"n": "PREFEITURA MUNICIPAL DE SANTA QUITÉRIA", "o": "JOÃO"}, {"n": "PREFEITURA MUNICIPAL DE MARANGUAPE", "o": "JOÃO"}, {"n": "PREFEITURA MUNICIPAL DE CANINDÉ", "o": "JOÃO"}, {"n": "PREFEITURA MUNICIPAL DE AURORA", "o": "JOÃO"}, {"n": "PREFEITURA MUNICIPAL DE ICAPUÍ", "o": "KAIKE"}, {"n": "PREFEITURA MUNICIPAL DE PEREIRO", "o": "KAIKE"}, {"n": "PREFEITURA MUNICIPAL DE QUIXERÉ", "o": "KAIKE"}, {"n": "PREFEITURA MUNICIPAL DE POTENGI", "o": "KAIKE"}, {"n": "PREFEITURA MUNICIPAL DE CATARINA", "o": "KAIKE"}, {"n": "PREFEITURA MUNICIPAL DE ARATUBA", "o": "KAIKE"}, {"n": "PREFEITURA MUNICIPAL DE QUIXADA", "o": "KAIKE"}, {"n": "PREFEITURA MUNICIPAL DE JAGUARETAMA", "o": "KAIKE"}, {"n": "PREFEITURA MUNICIPAL DE PORANGA", "o": "KAIKE"}, {"n": "PREFEITURA MUNICIPAL DE CARNAUBAL", "o": "KAIKE"}, {"n": "PREFEITURA MUNICIPAL DE ARACOIABA", "o": "KAIKE"}, {"n": "PREFEITURA MUNICIPAL DE ITAPIPOCA", "o": "KAIKE"}, {"n": "PREFEITURA MUNICIPAL DE AIUABA", "o": "KAIKE"}, {"n": "PREFEITURA MUNICIPAL DE TIANGUÁ", "o": "KAIKE"}, {"n": "PREFEITURA MUNICIPAL DE JUAZEIRO DO NORTE", "o": "KAIKE"}, {"n": "PREFEITURA MUNICIPAL DE ITAREMA", "o": "KAIKE"}, {"n": "PREFEITURA MUNICIPAL DE ITAITINGA", "o": "KAIKE"}, {"n": "PREFEITURA MUNICIPAL DE FORTIM", "o": "KAIKE"}, {"n": "PREFEITURA MUNICIPAL DE PACOTI", "o": "KAIKE"}, {"n": "PREFEITURA MUNICIPAL DE MARCO", "o": "KAIKE"}, {"n": "PREFEITURA MUNICIPAL DE BARBALHA", "o": "KAIKE"}, {"n": "PREFEITURA MUNICIPAL DE ASSARÉ", "o": "KAIKE"}, {"n": "PREFEITURA MUNICIPAL DE JAGUARUANA", "o": "KAIKE"}, {"n": "PREFEITURA MUNICIPAL DE CATUNDA", "o": "KAIKE"}, {"n": "PREFEITURA MUNICIPAL DE BELA CRUZ", "o": "KAIRON"}, {"n": "PREFEITURA MUNICIPAL DE BOA VIAGEM", "o": "KAIRON"}, {"n": "PREFEITURA MUNICIPAL DE ALTO SANTO", "o": "KAIRON"}, {"n": "PREFEITURA MUNICIPAL DE PIQUET CARNEIRO", "o": "KAIRON"}, {"n": "PREFEITURA MUNICIPAL DE PALHANO", "o": "KAIRON"}, {"n": "PREFEITURA MUNICIPAL DE INDEPENDENCIA", "o": "KAIRON"}, {"n": "PREFEITURA MUNICIPAL DE TEJUÇUOCA", "o": "KAIRON"}, {"n": "PREFEITURA MUNICIPAL DE SANTANA DO CARIRI", "o": "KAIRON"}, {"n": "PREFEITURA MUNICIPAL DE POTIRETAMA", "o": "KAIRON"}, {"n": "PREFEITURA MUNICIPAL DE NOVO ORIENTE", "o": "KAIRON"}, {"n": "PREFEITURA MUNICIPAL DE MIRAÍMA", "o": "KAIRON"}, {"n": "PREFEITURA MUNICIPAL DE MILAGRES", "o": "KAIRON"}, {"n": "PREFEITURA MUNICIPAL DE GUARACIABA DO NORTE", "o": "KAIRON"}, {"n": "PREFEITURA MUNICIPAL DE CARIRÉ", "o": "KAIRON"}, {"n": "PREFEITURA MUNICIPAL DE PACATUBA", "o": "KAIRON"}, {"n": "PREFEITURA MUNICIPAL DE BARRO", "o": "KAIRON"},
    {n:"CÂMARA MUNICIPAL DE ACARAPE", o:"CLEYDIR"}, {n:"CAMARA MUNICIPAL DE ARARENDA", o:"CLEYDIR"}, {n:"CÂMARA MUNICIPAL DE ASSARÉ", o:"CLEYDIR"}, {n:"CÂMARA MUNICIPAL DE CARIRÉ", o:"CLEYDIR"}, {n:"CÂMARA MUNICIPAL DE ERERÉ", o:"CLEYDIR"}, {n:"CÂMARA MUNICIPAL DE GRANJA", o:"CLEYDIR"}, {n:"CÂMARA MUNICIPAL DE ICÓ", o:"CLEYDIR"}, {n:"CÂMARA MUNICIPAL DE JARDIM", o:"CLEYDIR"}, {n:"CÂMARA MUNICIPAL DE MONSENHOR TABOSA", o:"CLEYDIR"}, {n:"CÂMARA MUNICIPAL DE MORADA NOVA", o:"CLEYDIR"}, {n:"CÂMARA MUNICIPAL DE ORÓS", o:"CLEYDIR"}, {n:"CÂMARA MUNICIPAL DE AIUABA", o:"DAVI"}, {n:"CÂMARA MUNICIPAL DE ARARIPE", o:"DAVI"}, {n:"CÂMARA MUNICIPAL DE PACAJUS", o:"DAVI"}, {n:"CÂMARA MUNICIPAL DE PACATUBA", o:"DAVI"}, {n:"CÂMARA MUNICIPAL DE PEDRA BRANCA", o:"DAVI"}, {n:"CÂMARA MUNICIPAL DE PEREIRO", o:"DAVI"}, {n:"CÂMARA MUNICIPAL DE POTENGI", o:"DAVI"}, {n:"CÂMARA MUNICIPAL DE POTIRETAMA", o:"DAVI"}, {n:"CÂMARA MUNICIPAL DE SABOEIRO", o:"DAVI"}, {n:"CÂMARA MUNICIPAL DE VARZEA ALEGRE", o:"DAVI"}, {n:"CÂMARA MUNICIPAL DE BATURITÉ", o:"CLEYDIR"}, {n:"CÂMARA MUNICIPAL DE CEDRO", o:"FELIPE"}, {n:"CÂMARA MUNICIPAL DE GENERAL SAMPAIO", o:"DAVI"}, {n:"CÂMARA MUNICIPAL DE IPU", o:"KAIRON"}, {n:"CÂMARA MUNICIPAL DE ITAPIPOCA", o:"FELIPE"}, {n:"CÂMARA MUNICIPAL DE JIJOCA DE JERICOACOARA", o:"JOÃO"}, {n:"CÂMARA MUNICIPAL DE LIMOEIRO DO NORTE", o:"DAVI"}, {n:"CÂMARA MUNICIPAL DE MILAGRES", o:"KAIKE"}, {n:"CÂMARA MUNICIPAL DE PENTECOSTE", o:"KAIRON"}, {n:"CÂMARA MUNICIPAL DE QUIXELÔ", o:"JOÃO"}, {n:"CÂMARA MUNICIPAL DE SALITRE", o:"DAVI"}, {n:"CÂMARA MUNICIPAL DE ALTANEIRA", o:"FELIPE"}, {n:"CAMARA MUNICIPAL DE AQUIRAZ", o:"FELIPE"}, {n:"CÂMARA MUNICIPAL DE CAMOCIM", o:"FELIPE"}, {n:"CÂMARA MUNICIPAL DE HIDROLÂNDIA", o:"FELIPE"}, {n:"CÂMARA MUNICIPAL DE LAVRAS DA MANGABEIRA", o:"FELIPE"}, {n:"CÂMARA MUNICIPAL DE MADALENA", o:"FELIPE"}, {n:"CÂMARA MUNICIPAL DE MAURITI", o:"FELIPE"}, {n:"CÂMARA MUNICIPAL DE NOVO ORIENTE", o:"FELIPE"}, {n:"CÂMARA MUNICIPAL DE SÃO BENEDITO", o:"FELIPE"}, {n:"CÂMARA MUNICIPAL DE SOBRAL", o:"FELIPE"}, {n:"CÂMARA MUNICIPAL DE UMARI", o:"FELIPE"}, {n:"CÂMARA MUNICIPAL DE AMONTADA", o:"JOÃO"}, {n:"CÂMARA MUNICIPAL DE APUIARÉS", o:"JOÃO"}, {n:"CÂMARA MUNICIPAL DE AURORA", o:"JOÃO"}, {n:"CÂMARA MUNICIPAL DE BAIXIO", o:"JOÃO"}, {n:"CÂMARA MUNICIPAL DE BARBALHA", o:"JOÃO"}, {n:"CÂMARA MUNICIPAL DE BARREIRA", o:"JOÃO"}, {n:"CÂMARA MUNICIPAL DE FORTIM - CE", o:"JOÃO"}, {n:"CÂMARA MUNICIPAL DE IPAUMIRIM", o:"JOÃO"}, {n:"CÂMARA MUNICIPAL DE MARACANAÚ", o:"JOÃO"}, {n:"CÂMARA MUNICIPAL DE MIRAÍMA", o:"JOÃO"}, {n:"CÂMARA MUNICIPAL DE MISSÃO VELHA", o:"JOÃO"}, {n:"CÂMARA MUNICIPAL DE TRAIRI", o:"JOÃO"}, {n:"CÂMARA MUNICIPAL DE CAMPOS SALES", o:"KAIKE"}, {n:"CÂMARA MUNICIPAL DE ICAPUÍ", o:"KAIKE"}, {n:"CÂMARA MUNICIPAL DE INDEPENDÊNCIA", o:"KAIKE"}, {n:"CÂMARA MUNICIPAL DE IPAPORANGA", o:"KAIKE"}, {n:"CÂMARA MUNICIPAL DE ITAITINGA", o:"KAIKE"}, {n:"CÂMARA MUNICIPAL de MARCO", o:"KAIKE"}, {n:"CÂMARA MUNICIPAL DE TAUÁ", o:"KAIKE"}, {n:"CÂMARA MUNICIPAL DE TURURU", o:"KAIKE"}, {n:"CÂMARA MUNICIPAL DE URUOCA", o:"KAIKE"}, {n:"CÂMARA MUNICIPAL DE VIÇOSA DO CEARA", o:"KAIKE"}, {n:"CÂMARA MUNICIPAL DE ARACOIABA", o:"KAIRON"}, {n:"CÂMARA MUNICIPAL DE CAPISTRANO", o:"KAIRON"}, {n:"CÂMARA MUNICIPAL DE CARIDADE", o:"KAIRON"}, {n:"CÂMARA MUNICIPAL DE CHORÓ", o:"KAIRON"}, {n:"CÂMARA MUNICIPAL DE CRUZ", o:"KAIRON"}, {n:"CÂMARA MUNICIPAL DE GRANJEIRO", o:"KAIRON"}, {n:"CÂMARA MUNICIPAL DE GUARAMIRANGA", o:"KAIRON"}, {n:"CÂMARA MUNICIPAL DE MORRINHOS", o:"KAIRON"}, {n:"CÂMARA MUNICIPAL DE PALHANO", o:"KAIRON"}, {n:"CÂMARA MUNICIPAL DE PORANGA", o:"KAIRON"}
];

function normalizarTexto(texto) {
    if (!texto) return "";
    return texto.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
}

// ============================================================================
// 2. FUNÇÃO PRINCIPAL DO APP 
// ============================================================================
function App() {

  const [usuarioLogado, setUsuarioLogado] = useState(false);
  const [carregandoLogin, setCarregandoLogin] = useState(true); 
  const [loginUser, setLoginUser] = useState("");
  const [loginSenha, setLoginSenha] = useState("");
  const [loginErro, setLoginErro] = useState("");
  const [modoCadastro, setModoCadastro] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);
  const [submenuTabelasAberto, setSubmenuTabelasAberto] = useState(false);
  const [submenuDadosAberto, setSubmenuDadosAberto] = useState(false);

  // --- NOVO: ESTADOS DO BANCO DE DADOS EM NUVEM ---
  const [bancoDeDados, setBancoDeDados] = useState({});
  const [dadosCarregadosDaNuvem, setDadosCarregadosDaNuvem] = useState(false);

  // --- BUSCAR DADOS DA NUVEM AO LOGAR ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
            setUsuarioLogado(true);
            try {
                const docRef = doc(db, "sistema", "bancoGeral");
                const docSnap = await getDoc(docRef);
                
                if (docSnap.exists()) {
                    setBancoDeDados(docSnap.data());
                } else {
                    // Se o banco estiver vazio na nuvem, ele cria a base
                    let dbInicial = {};
                    DATA_ENTIDADES.forEach(item => {
                        const id = "ENT_" + item.n.replace(/\s/g, "_");
                        dbInicial[id] = { id: id, nome: item.n, operador: item.o, controlador: "", telefone: "", perc: 0, selo: "INEXISTENTE", marcados: {} };
                    });
                    setBancoDeDados(dbInicial);
                    await setDoc(docRef, dbInicial);
                }
                setDadosCarregadosDaNuvem(true);
            } catch(e) {
                console.error("Erro ao carregar do Firestore:", e);
                alert("Erro ao conectar com a nuvem. Verifique sua conexão.");
            }
        } else {
            setUsuarioLogado(false);
            setBancoDeDados({});
            setDadosCarregadosDaNuvem(false);
        }
        setCarregandoLogin(false);
    });
    return () => unsubscribe();
  }, []);

  // --- SALVAR NA NUVEM AUTOMATICAMENTE ---
  useEffect(() => {
    if (dadosCarregadosDaNuvem && usuarioLogado) {
        const salvar = async () => {
            try {
                await setDoc(doc(db, "sistema", "bancoGeral"), bancoDeDados);
            } catch (e) {
                console.error("Erro ao salvar na nuvem:", e);
            }
        };
        salvar();
    }
  }, [bancoDeDados, dadosCarregadosDaNuvem, usuarioLogado]);

  const [telaAtiva, setTelaAtiva] = useState('lista'); 
  const [entidadeEditando, setEntidadeEditando] = useState(null); 
  const [limiteExibicao, setLimiteExibicao] = useState(25);
  const [termoBusca, setTermoBusca] = useState("");
  const [filtroPoder, setFiltroPoder] = useState('todos'); 
  const [filtroOperador, setFiltroOperador] = useState('todos');
  const [filtroSelo, setFiltroSelo] = useState('todos');
  const [filtroControlador, setFiltroControlador] = useState('todos');
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [showBottomBtn, setShowBottomBtn] = useState(false);

  // Estados Cadastro/Edição
  const [novoNome, setNovoNome] = useState("");
  const [novoOperador, setNovoOperador] = useState("CLEYDIR");
  const [novoControlador, setNovoControlador] = useState("");
  const [novoTelefone, setNovoTelefone] = useState("");
  const [idEdicao, setIdEdicao] = useState(null);
  const [editNome, setEditNome] = useState("");
  const [editOperador, setEditOperador] = useState("");
  const [editControlador, setEditControlador] = useState("");
  const [editTelefone, setEditTelefone] = useState("");
  const [idExclusao, setIdExclusao] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
        const scrolled = document.documentElement.scrollTop;
        const windowHeight = document.documentElement.clientHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const screenWidth = window.innerWidth;
        setShowTopBtn(scrolled > 300);
        const distanceToBottom = documentHeight - (scrolled + windowHeight);
        const notAtBottom = distanceToBottom > 150; 
        const limiteMinimo = screenWidth <= 768 ? 50 : 75;
        if (notAtBottom && ((telaAtiva === 'lista' && limiteExibicao >= limiteMinimo) || telaAtiva !== 'lista')) {
            setShowBottomBtn(true);
        } else {
            setShowBottomBtn(false);
        }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [limiteExibicao, telaAtiva]);

  const rolarParaTopo = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const rolarParaFundo = () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });

  const efetuarLogin = async (e) => {
      e.preventDefault();
      setLoginErro("");
      try {
          if (modoCadastro) {
              await createUserWithEmailAndPassword(auth, loginUser, loginSenha);
              alert("Conta criada com sucesso! Redirecionando...");
          } else {
              await signInWithEmailAndPassword(auth, loginUser, loginSenha);
          }
      } catch (error) {
          console.error(error);
          if (error.code === 'auth/email-already-in-use') setLoginErro("Este e-mail já está cadastrado.");
          else if (error.code === 'auth/weak-password') setLoginErro("A senha deve ter pelo menos 6 caracteres.");
          else if (error.code === 'auth/invalid-credential') setLoginErro("E-mail ou senha incorretos.");
          else setLoginErro("Erro na autenticação. Verifique os dados e tente novamente.");
      }
  };

  const efetuarLogout = async () => {
      try {
          await signOut(auth); 
          setLoginUser("");
          setLoginSenha("");
          setMenuAberto(false); 
      } catch (error) {
          console.error("Erro ao sair", error);
      }
  };

  const exportarJSON = () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(bancoDeDados, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", `backup_atricon_${new Date().toISOString().slice(0,10)}.json`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      setMenuAberto(false);
  };

  const importarJSON = (event) => {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
          try {
              const parsed = JSON.parse(e.target.result);
              setBancoDeDados(parsed);
              alert("Backup restaurado e salvo na nuvem com sucesso! 🎉");
          } catch (err) {
              alert("Erro: O arquivo selecionado não é um JSON válido.");
          }
          event.target.value = null; 
      };
      reader.readAsText(file);
      setMenuAberto(false);
  };

  const exportarCSV = () => {
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "ID;Nome da Entidade;Operador;Controlador;Telefone;Progresso (%);Selo Atual\n"; 
      
      Object.values(bancoDeDados).forEach(ent => {
          const nomeLimpo = ent.nome.replace(/;/g, ",").replace(/"/g, "");
          const ctrlLimpo = (ent.controlador || "").replace(/;/g, ",");
          const row = `${ent.id};"${nomeLimpo}";${ent.operador};"${ctrlLimpo}";${ent.telefone || ""};${ent.perc};${ent.selo}`;
          csvContent += row + "\n";
      });
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `relatorio_atricon_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setMenuAberto(false);
  };

  const importarCSV = (event) => {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
          try {
              const text = e.target.result;
              const lines = text.split("\n");
              const newDb = { ...bancoDeDados };
              
              for(let i = 1; i < lines.length; i++) {
                  if(!lines[i].trim()) continue;
                  
                  const cols = lines[i].split(";"); 
                  if(cols.length >= 5) {
                      const id = cols[0].trim();
                      const nome = cols[1].replace(/"/g, "").trim();
                      const operador = cols[2].trim();
                      const controlador = cols[3].replace(/"/g, "").trim();
                      const telefone = cols[4].trim();

                      if(newDb[id]) {
                          newDb[id].nome = nome;
                          newDb[id].operador = operador;
                          newDb[id].controlador = controlador;
                          newDb[id].telefone = telefone;
                      } else {
                          newDb[id] = {
                              id: id, nome: nome, operador: operador, controlador: controlador, 
                              telefone: telefone, perc: 0, selo: "INEXISTENTE", marcados: {}
                          };
                      }
                  }
              }
              setBancoDeDados(newDb);
              alert("Dados do CSV importados para a nuvem com sucesso! 📊");
          } catch (err) {
              alert("Erro ao ler o arquivo CSV. Verifique a formatação.");
          }
          event.target.value = null;
      };
      reader.readAsText(file);
      setMenuAberto(false);
  }

  const executarCadastroModal = () => {
      const nomeOriginal = novoNome.trim().toUpperCase();
      if (!nomeOriginal || !novoOperador) { alert("Preencha os campos obrigatórios."); return; }
      const jaExiste = Object.values(bancoDeDados).some(ent => normalizarTexto(ent.nome).replace(/\s/g, "") === normalizarTexto(nomeOriginal).replace(/\s/g, ""));
      if (jaExiste) { alert("⚠️ Esta entidade já está cadastrada!"); return; }
      
      const id = "ENT_" + Date.now(); 
      setBancoDeDados(prevDb => {
          const newDb = { ...prevDb };
          newDb[id] = {
              id: id, nome: nomeOriginal, operador: novoOperador, controlador: novoControlador,
              telefone: novoTelefone, perc: 0, selo: "INEXISTENTE", marcados: {}
          };
          return newDb;
      });
      setNovoNome(""); setNovoOperador("CLEYDIR"); setNovoControlador(""); setNovoTelefone("");
      document.getElementById('btnFecharModalNovo').click();
  };

  const prepararEdicao = (id) => {
      const ent = bancoDeDados[id];
      setIdEdicao(id); setEditNome(ent.nome); setEditOperador(ent.operador);
      setEditControlador(ent.controlador || ""); setEditTelefone(ent.telefone || "");
  };

  const salvarEdicao = () => {
      const nomeFinal = editNome.trim().toUpperCase();
      if (!nomeFinal) { alert("O nome da entidade não pode ficar vazio!"); return; }
      if (nomeFinal !== bancoDeDados[idEdicao].nome) {
          const jaExiste = Object.values(bancoDeDados).some(ent => normalizarTexto(ent.nome).replace(/\s/g, "") === normalizarTexto(nomeFinal).replace(/\s/g, ""));
          if (jaExiste) { alert("⚠️ Já existe outra entidade cadastrada com este nome!"); return; }
      }
      setBancoDeDados(prevDb => {
          const newDb = { ...prevDb };
          newDb[idEdicao] = { ...newDb[idEdicao], nome: nomeFinal, operador: editOperador, controlador: editControlador, telefone: editTelefone };
          return newDb;
      });
      document.getElementById('btnFecharModalEdit').click();
  };

  const prepararExclusao = (id) => setIdExclusao(id);
  const executarExclusao = () => {
      setBancoDeDados(prevDb => {
          const newDb = { ...prevDb };
          delete newDb[idExclusao]; 
          return newDb;
      });
      document.getElementById('btnFecharModalExcluir').click();
  };

  const recalcularSelo = (entidade) => {
      let pontosTotais = 0, pontosObtidos = 0, faltaEssencial = false;
      const ehCamara = normalizarTexto(entidade.nome).includes('camara');
      GRUPOS_CRITERIOS.forEach(g => {
          const num = parseInt(g.titulo);
          if (ehCamara && [16, 17, 18, 19].includes(num)) return;
          if (!ehCamara && num === 20) return;
          let pesoDim = g.pesoDimensao || 1; 
          g.itens.forEach(i => {
              let pesoCrit = i.classificacao === 'essencial' ? 2 : (i.classificacao === 'obrigatoria' ? 1.5 : 1);
              let pontosDesteCriterio = pesoDim * pesoCrit;
              pontosTotais += pontosDesteCriterio;
              const s = entidade.marcados[i.id] || {g:false, s:false, a:false};
              const exige = i.exige || ['g', 's', 'a'];
              let atende = true;
              if (exige.includes('g') && !s.g) atende = false;
              if (exige.includes('s') && !s.s) atende = false;
              if (exige.includes('a') && !s.a) atende = false;
              if (atende) pontosObtidos += pontosDesteCriterio;
              else if (i.classificacao === 'essencial') faltaEssencial = true; 
          });
      });
      const perc = pontosTotais > 0 ? Math.round((pontosObtidos / pontosTotais) * 100) : 0;
      let selo = perc >= 95 ? (faltaEssencial ? "ELEVADO" : "DIAMANTE") : 
                 perc >= 85 ? (faltaEssencial ? "ELEVADO" : "OURO") : 
                 perc >= 75 ? (faltaEssencial ? "ELEVADO" : "PRATA") : 
                 perc >= 50 ? "INTERMEDIARIO" : perc >= 30 ? "BASICO" : perc > 0 ? "INICIAL" : "INEXISTENTE";
      return { perc, selo };
  };

  const handleToggleCheck = (idItem, tipo) => {
      setBancoDeDados(prevDb => {
          let newDb = JSON.parse(JSON.stringify(prevDb));
          let ent = newDb[entidadeEditando];
          if (!ent.marcados[idItem]) ent.marcados[idItem] = { g: false, s: false, a: false };
          ent.marcados[idItem][tipo] = !ent.marcados[idItem][tipo];
          const resultado = recalcularSelo(ent);
          ent.perc = resultado.perc;
          ent.selo = resultado.selo;
          return newDb;
      });
  };

  const handleMarcarGrupo = (tituloGrupo, marcar) => {
      setBancoDeDados(prevDb => {
          let newDb = JSON.parse(JSON.stringify(prevDb));
          let ent = newDb[entidadeEditando];
          const grupo = GRUPOS_CRITERIOS.find(g => g.titulo === tituloGrupo);
          grupo.itens.forEach(item => {
              if (!ent.marcados[item.id]) ent.marcados[item.id] = { g: false, s: false, a: false };
              if (marcar) {
                  const exige = item.exige || ['g', 's', 'a'];
                  if (exige.includes('g')) ent.marcados[item.id].g = true;
                  if (exige.includes('s')) ent.marcados[item.id].s = true;
                  if (exige.includes('a')) ent.marcados[item.id].a = true;
              } else {
                  ent.marcados[item.id] = { g: false, s: false, a: false };
              }
          });
          const resultado = recalcularSelo(ent);
          ent.perc = resultado.perc;
          ent.selo = resultado.selo;
          return newDb;
      });
  };

  const chavesFiltradas = Object.keys(bancoDeDados).filter(id => {
      const ent = bancoDeDados[id];
      const nomeBusca = normalizarTexto(ent.nome);
      const termoNorm = normalizarTexto(termoBusca);
      const passaTexto = nomeBusca.includes(termoNorm);
      const passaOperador = (filtroOperador === 'todos') || (ent.operador === filtroOperador);
      const passaSelo = (filtroSelo === 'todos') || (ent.selo === filtroSelo);
      let passaControlador = true;
      if (filtroControlador === 'com') passaControlador = (ent.controlador && ent.controlador.trim() !== "");
      else if (filtroControlador === 'sem') passaControlador = (!ent.controlador || ent.controlador.trim() === "");
      const ehPrefeitura = nomeBusca.includes('prefeitura');
      const ehCamara = nomeBusca.includes('camara'); 
      const passaPoder = (filtroPoder === 'todos') || 
                         (filtroPoder === 'prefeitura' && ehPrefeitura) || 
                         (filtroPoder === 'camara' && ehCamara);
      return passaTexto && passaOperador && passaSelo && passaControlador && passaPoder;
  });

  const entidadesParaExibir = chavesFiltradas.slice(0, limiteExibicao);
  const totalNoBanco = Object.keys(bancoDeDados).length;
  const entidadesAvaliadas = Object.values(bancoDeDados).filter(e => e.perc > 0).length;

  // ============================================================================
  // TELA DE CARREGAMENTO INICIAL
  // ============================================================================
  if (carregandoLogin || (usuarioLogado && !dadosCarregadosDaNuvem)) {
      return (
          <div className="d-flex flex-column align-items-center justify-content-center vh-100" style={{ backgroundColor: 'var(--bg-pagina)' }}>
              <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}></div>
              <h5 className="fw-bold text-muted">Sincronizando com a nuvem... ☁️</h5>
          </div>
      ); 
  }

  // ============================================================================
  // TELA DE LOGIN / CADASTRO
  // ============================================================================
  if (!usuarioLogado) {
      return (
          <div className="d-flex align-items-center justify-content-center vh-100" style={{ backgroundColor: 'var(--bg-pagina)' }}>
              <div className="card border-0 shadow-lg dark-card-target" style={{ maxWidth: '400px', width: '100%', borderRadius: '16px' }}>
                  <div className="card-body p-5">
                      <div className="text-center mb-4">
                          <div className="bg-primary text-white d-inline-flex align-items-center justify-content-center mb-3 shadow-sm" style={{ width: '60px', height: '60px', borderRadius: '12px' }}>
                              <i className={modoCadastro ? "bi bi-person-plus-fill fs-2" : "bi bi-shield-lock-fill fs-2"}></i>
                          </div>
                          <h4 className="fw-bold text-primary">
                              {modoCadastro ? "Criar Nova Conta" : "Acesso Restrito"}
                          </h4>
                          <p className="text-muted small">
                              {modoCadastro ? "Cadastre-se para acessar o Simulador Atricon." : "Faça login para acessar o Simulador Atricon."}
                          </p>
                      </div>

                      {loginErro && (
                          <div className="alert alert-danger py-2 small text-center border-0 shadow-sm">
                              <i className="bi bi-exclamation-triangle-fill me-2"></i>{loginErro}
                          </div>
                      )}

                      <form onSubmit={efetuarLogin}>
                          <div className="mb-3">
                              <label className="form-label fw-bold text-muted small">E-mail</label>
                              <div className="input-group shadow-sm">
                                  <span className="input-group-text bg-light border-end-0"><i className="bi bi-envelope text-muted"></i></span>
                                  <input type="email" className="form-control bg-light border-start-0 ps-0" placeholder="Digite seu e-mail" value={loginUser} onChange={(e) => setLoginUser(e.target.value)} required />
                              </div>
                          </div>
                          <div className="mb-4">
                              <label className="form-label fw-bold text-muted small">Senha</label>
                              <div className="input-group shadow-sm">
                                  <span className="input-group-text bg-light border-end-0"><i className="bi bi-key text-muted"></i></span>
                                  <input type="password" className="form-control bg-light border-start-0 ps-0" placeholder="••••••••" value={loginSenha} onChange={(e) => setLoginSenha(e.target.value)} required />
                              </div>
                          </div>
                          <button type="submit" className="btn btn-primary w-100 py-2 fw-bold shadow-sm">
                              {modoCadastro ? "Cadastrar e Entrar" : "Entrar no Sistema"}
                          </button>
                      </form>
                      
                      <div className="text-center mt-3">
                          <span 
                              onClick={() => { setModoCadastro(!modoCadastro); setLoginErro(""); }} 
                              style={{ color: '#0d6efd', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.85rem', fontWeight: '500' }}
                          >
                              {modoCadastro ? "Já tem uma conta? Faça login." : "Não tem uma conta? Cadastre-se."}
                          </span>
                      </div>

                      <div className="text-center mt-4 text-muted" style={{ fontSize: '0.75rem' }}>
                          © 2026 TD2 - Simulador de Transparência
                      </div>
                  </div>
              </div>
          </div>
      );
  }

  // ============================================================================
  // TELA PRINCIPAL (SISTEMA LOGADO)
  // ============================================================================
  return (
    <>
      <button onClick={() => setMenuAberto(true)} className="btn-menu-lateral border-0 shadow-sm">
        <i className="bi bi-list fs-4"></i>
      </button>

      {/* --- CÓDIGO DO MENU LATERAL (SIDEBAR) --- */}
      {menuAberto && (
        <div className="modal-backdrop fade show" onClick={() => setMenuAberto(false)} style={{ zIndex: 1040 }}></div>
      )}
      
      <div id="sidebar" className={menuAberto ? 'active' : ''} style={{ zIndex: 1050, overflowY: 'auto' }}>
        <div className="p-4 d-flex flex-column min-vh-100">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="fw-bold text-primary m-0"><i className="bi bi-grid-1x2-fill me-2"></i> Menu</h5>
            <button onClick={() => setMenuAberto(false)} className="btn btn-light btn-sm rounded-circle border shadow-sm" id="btnCloseSidebar">
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
          
          <div className="d-flex flex-column gap-2 mb-4">
            
            {/* --- GAVETA 1: TABELAS --- */}
            <button 
              className="btn btn-light text-start fw-bold p-3 border shadow-sm d-flex justify-content-between align-items-center" 
              onClick={() => setSubmenuTabelasAberto(!submenuTabelasAberto)}
            >
              <span><i className="bi bi-table me-2 text-primary"></i> Tabelas</span>
              <i className={`bi bi-chevron-${submenuTabelasAberto ? 'up' : 'down'} text-muted`}></i>
            </button>

            {submenuTabelasAberto && (
              <div className="d-flex flex-column gap-2 ms-3 border-start ps-2">
                <button className="btn btn-light text-start fw-bold p-2 shadow-sm" onClick={() => { setMenuAberto(false); alert("Em breve!"); }}>
                  <i className="bi bi-building me-2 text-secondary"></i> Prefeituras
                </button>
                <button className="btn btn-light text-start fw-bold p-2 shadow-sm" onClick={() => { setMenuAberto(false); alert("Em breve!"); }}>
                  <i className="bi bi-bank me-2 text-secondary"></i> Câmaras
                </button>
                <button className="btn btn-light text-start fw-bold p-2 shadow-sm" onClick={() => { setMenuAberto(false); alert("Em breve!"); }}>
                  <i className="bi bi-people me-2 text-secondary"></i> Controladores
                </button>
              </div>
            )}

            {/* --- GAVETA 2: DADOS E BACKUP --- */}
            <button 
              className="btn btn-light text-start fw-bold p-3 border shadow-sm d-flex justify-content-between align-items-center mt-2" 
              onClick={() => setSubmenuDadosAberto(!submenuDadosAberto)}
            >
              <span><i className="bi bi-database-down me-2 text-success"></i> Dados e Backup</span>
              <i className={`bi bi-chevron-${submenuDadosAberto ? 'up' : 'down'} text-muted`}></i>
            </button>

            {submenuDadosAberto && (
              <div className="d-flex flex-column gap-2 ms-3 border-start ps-2">
                
                {/* Exportar JSON */}
                <button className="btn btn-light text-start fw-bold p-2 shadow-sm text-success" onClick={exportarJSON}>
                  <i className="bi bi-download me-2"></i> Exportar (JSON)
                </button>
                
                {/* Importar JSON (Usa um input file escondido) */}
                <button className="btn btn-light text-start fw-bold p-2 shadow-sm text-success" onClick={() => document.getElementById('importarJsonInput').click()}>
                  <i className="bi bi-upload me-2"></i> Importar (JSON)
                </button>
                <input type="file" id="importarJsonInput" accept=".json" style={{ display: 'none' }} onChange={importarJSON} />

                {/* Exportar CSV */}
                <button className="btn btn-light text-start fw-bold p-2 shadow-sm text-primary mt-2" onClick={exportarCSV}>
                  <i className="bi bi-file-earmark-excel me-2"></i> Exportar (CSV)
                </button>
                
                {/* Importar CSV */}
                <button className="btn btn-light text-start fw-bold p-2 shadow-sm text-primary" onClick={() => document.getElementById('importarCsvInput').click()}>
                  <i className="bi bi-file-earmark-arrow-up me-2"></i> Importar (CSV)
                </button>
                <input type="file" id="importarCsvInput" accept=".csv" style={{ display: 'none' }} onChange={importarCSV} />

              </div>
            )}
          </div>

          <hr className="text-muted mt-auto" />
          <button onClick={efetuarLogout} className="btn btn-danger text-start fw-bold p-3 shadow-sm">
            <i className="bi bi-box-arrow-left me-2"></i> Sair do Sistema
          </button>
        </div>
      </div>
      {/* --- FIM DO MENU LATERAL --- */}


      <button 
        onClick={efetuarLogout} 
        className="btn btn-light text-danger shadow-sm border" 
        style={{ position: 'fixed', right: '8px', top: '20px', zIndex: 1000, borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        title="Sair do Sistema"
      >
        <i className="bi bi-box-arrow-right fs-5"></i>
      </button>

      <div onClick={rolarParaTopo} className={`btn-floating-top ${showTopBtn ? 'visible' : ''} ${telaAtiva === 'avaliacao' ? 'empurrado' : ''}`}>
        <i className="bi bi-rocket-fill"></i>
      </div>
      <div onClick={rolarParaFundo} className={`btn-floating-bottom ${showBottomBtn ? 'visible' : ''} ${telaAtiva === 'avaliacao' ? 'empurrado' : ''}`}>
        <i className="bi bi-arrow-down-square-fill"></i>
      </div>
      {telaAtiva === 'avaliacao' && (
        <div className="btn-floating-help" data-bs-toggle="modal" data-bs-target="#modalAjuda">
          <i className="bi bi-question-lg"></i>
        </div>
      )}

      <main className="container pb-1" style={{ paddingTop: '85px' }}>
        {telaAtiva === 'lista' && (
          <div className="fade-screen show">
            <div className="text-center mb-4">
              <h2 className="fw-bold">Simulador de Avaliação Atricon</h2>
              <p className="text-muted">Gerencie e avalie o nível de transparência das entidades.</p>
            </div>

            <div className="d-flex justify-content-center mb-4">
              <div className="btn-group shadow-sm">
                <button onClick={() => setFiltroPoder('todos')} className={`btn ${filtroPoder === 'todos' ? 'btn-primary' : 'btn-outline-primary'} px-4`}>Todos</button>
                <button onClick={() => setFiltroPoder('prefeitura')} className={`btn ${filtroPoder === 'prefeitura' ? 'btn-primary' : 'btn-outline-primary'} px-4`}>Executivo</button>
                <button onClick={() => setFiltroPoder('camara')} className={`btn ${filtroPoder === 'camara' ? 'btn-primary' : 'btn-outline-primary'} px-4`}>Legislativo</button>
              </div>
            </div>

            <div className="card shadow-sm border-0 mb-4 dark-card-target">
              <div className="card-body p-3">
                <div className="d-flex gap-2 mb-3">
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0"><i className="bi bi-search text-muted"></i></span>
                    <input type="text" className="form-control border-start-0 ps-0" placeholder="Pesquisar..." value={termoBusca} onChange={(e) => { setTermoBusca(e.target.value); setLimiteExibicao(25); }} />
                  </div>
                  <button className="btn btn-primary px-4 fw-bold" data-bs-toggle="modal" data-bs-target="#modalNovoCadastro">
                    <i className="bi bi-plus-lg me-1"></i> Novo
                  </button>
                </div>
                
                <div className="d-flex flex-column gap-2">
                  <select className="form-select text-muted bg-light" value={filtroOperador} onChange={(e) => setFiltroOperador(e.target.value)}>
                    <option value="todos">📱 Todos Operadores</option>
                    <option value="CLEYDIR">CLEYDIR</option>
                    <option value="DAVI">DAVI</option>
                    <option value="FELIPE">FELIPE</option>
                    <option value="JOÃO">JOÃO</option>
                    <option value="KAIKE">KAIKE</option>
                    <option value="KAIRON">KAIRON</option>
                  </select>
                  <select className="form-select text-muted bg-light" value={filtroSelo} onChange={(e) => setFiltroSelo(e.target.value)}>
                    <option value="todos">🎖️ Todos Selos</option>
                    <option value="DIAMANTE">DIAMANTE</option>
                    <option value="OURO">OURO</option>
                    <option value="PRATA">PRATA</option>
                    <option value="ELEVADO">ELEVADO</option>
                    <option value="INTERMEDIARIO">INTERMEDIARIO</option>
                    <option value="BASICO">BÁSICO</option>
                    <option value="INICIAL">INICIAL</option>
                    <option value="INEXISTENTE">INEXISTENTE</option>
                  </select>
                  <select className="form-select text-muted bg-light" value={filtroControlador} onChange={(e) => setFiltroControlador(e.target.value)}>
                    <option value="todos">👤 Controladores: Todos</option>
                    <option value="com">Com Controlador</option>
                    <option value="sem">Sem Controlador</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="row g-3" id="gridClientes">
              {entidadesParaExibir.map((id) => {
                const ent = bancoDeDados[id];
                const slug = normalizarTexto(ent.selo);
                const foneLimpo = ent.telefone ? ent.telefone.replace(/\D/g, '') : "";

                return (
                  <div className="col-md-4" key={id}>
                    <div className="card shadow-sm border-0 p-3 h-100 dark-card-target text-center">
                      <div className="mb-2"><span className="badge-operador">{ent.operador}</span></div>
                      <h6 className="fw-bold mb-1">{ent.nome}</h6>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="text-muted small" style={{ fontSize: '0.75rem' }}>Controlador: {ent.controlador || '---'}</span>
                        {foneLimpo && <a href={`https://wa.me/55${foneLimpo}`} target="_blank" rel="noreferrer" className="text-success ms-2"><i className="bi bi-whatsapp"></i></a>}
                      </div>
                      <div className={`badge w-100 mb-3 p-2 selo-${slug}`}>{ent.selo} ({ent.perc}%)</div>
                      
                      <div className="d-flex gap-2">
                        <button onClick={() => { setEntidadeEditando(id); setTelaAtiva('avaliacao'); window.scrollTo(0,0); }} className="btn btn-primary btn-sm flex-grow-1 fw-bold">Avaliar</button>
                        <button onClick={() => prepararEdicao(id)} data-bs-toggle="modal" data-bs-target="#modalEditarCadastro" className="btn btn-outline-secondary btn-sm"><i className="bi bi-pencil"></i></button>
                        <button onClick={() => prepararExclusao(id)} data-bs-toggle="modal" data-bs-target="#modalConfirmarExclusao" className="btn btn-outline-danger btn-sm"><i className="bi bi-trash"></i></button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {chavesFiltradas.length > limiteExibicao && (
              <div className="d-flex justify-content-center gap-3 mt-4">
                <button onClick={() => setLimiteExibicao(l => l + 25)} className="btn btn-outline-primary fw-bold px-4 py-2 bg-white">
                  <i className="bi bi-plus-circle me-1"></i> Carregar mais 25
                </button>
                <button onClick={() => setLimiteExibicao(9999)} className="btn btn-primary fw-bold px-4 py-2">
                  <i className="bi bi-eye me-1"></i> Exibir Todos
                </button>
              </div>
            )}
          </div>
        )}

        {telaAtiva === 'avaliacao' && entidadeEditando && (
          <div className="fade-screen show">
            <button onClick={() => { setTelaAtiva('lista'); setEntidadeEditando(null); window.scrollTo(0,0); }} className="btn btn-light border shadow-sm mb-4 fw-bold">
              <i className="bi bi-arrow-left me-2"></i> Voltar
            </button>

            <div className="card shadow-sm border-0 mb-4 dark-card-target">
              <div className="card-body">
                <h4 className="fw-bold text-center text-primary mb-3">{bancoDeDados[entidadeEditando].nome}</h4>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="fw-bold">Progresso Geral:</span>
                  <span className={`badge p-3 fs-6 rounded-pill selo-${normalizarTexto(bancoDeDados[entidadeEditando].selo)}`}>
                    {bancoDeDados[entidadeEditando].selo}
                  </span>
                </div>
                <div className="progress" style={{ height: '25px', borderRadius: '12px' }}>
                  <div className="progress-bar bg-success progress-bar-striped progress-bar-animated fw-bold fs-6" style={{ width: `${bancoDeDados[entidadeEditando].perc}%` }}>
                    {bancoDeDados[entidadeEditando].perc}%
                  </div>
                </div>
              </div>
            </div>

            <div>
              {GRUPOS_CRITERIOS.map((grupo, index) => {
                  const ehCamara = normalizarTexto(bancoDeDados[entidadeEditando].nome).includes('camara');
                  const num = parseInt(grupo.titulo);
                  if (ehCamara && [16, 17, 18, 19].includes(num)) return null;
                  if (!ehCamara && num === 20) return null;
                  const collapseId = `collapse_grupo_${index}`;

                  return (
                    <div key={index}>
                      <div className="grupo-header d-flex flex-column flex-md-row justify-content-between align-items-md-center mt-4" style={{ padding: '12px 16px' }}>
                          <span style={{ cursor: 'pointer', userSelect: 'none' }} data-bs-toggle="collapse" data-bs-target={`#${collapseId}`} className="text-white fw-bold mb-3 mb-md-0">
                              <i className="bi bi-caret-down-fill me-1 opacity-75"></i> {grupo.titulo}
                          </span>
                          <div className="d-flex justify-content-between align-items-center w-100" style={{ maxWidth: '400px' }}>
                              <div className="d-flex gap-2">
                                  <button onClick={() => handleMarcarGrupo(grupo.titulo, true)} className="btn btn-sm btn-primary px-2 py-1 shadow-sm" style={{ fontSize: '0.75rem' }}>Marcar Tudo</button>
                                  <button onClick={() => handleMarcarGrupo(grupo.titulo, false)} className="btn btn-sm btn-secondary px-2 py-1 shadow-sm" style={{ fontSize: '0.75rem' }}>Desmarcar</button>
                              </div>
                              <div className="d-flex" style={{ width: '120px', flexShrink: 0 }}>
                                  <div style={{ width: '40px', textAlign: 'center' }} className="fw-bold text-white">D</div>
                                  <div style={{ width: '40px', textAlign: 'center' }} className="fw-bold text-white">A</div>
                                  <div style={{ width: '40px', textAlign: 'center' }} className="fw-bold text-white">S</div>
                              </div>
                          </div>
                      </div>
                      <div className="collapse show" id={collapseId}>
                          <ul className="list-group mb-3">
                            {grupo.itens.map(item => {
                                const st = bancoDeDados[entidadeEditando].marcados[item.id] || { g: false, s: false, a: false };
                                const exige = item.exige || ['g', 's', 'a'];
                                return (
                                  <li key={item.id} className="list-group-item d-flex align-items-center dark-card-target" style={{ padding: '12px 16px' }}>
                                      <div className="flex-grow-1 pe-3" style={{ fontSize: '0.9rem' }}>
                                          <small className="text-muted fw-bold">{item.id}</small> {item.classificacao === 'essencial' && <b className="text-danger">*</b>} 
                                          <br/><span className="d-block mt-1">{item.nome}</span>
                                      </div>
                                      <div className="d-flex" style={{ width: '120px', flexShrink: 0 }}>
                                          <div className="d-flex justify-content-center align-items-center" style={{ width: '40px' }}>
                                            <input type="checkbox" checked={st.g} onChange={() => handleToggleCheck(item.id, 'g')} className="form-check-input m-0 border-secondary" style={{ cursor: 'pointer', width: '1.2rem', height: '1.2rem', visibility: exige.includes('g') ? 'visible' : 'hidden' }} />
                                          </div>
                                          <div className="d-flex justify-content-center align-items-center" style={{ width: '40px' }}>
                                            <input type="checkbox" checked={st.s} onChange={() => handleToggleCheck(item.id, 's')} className="form-check-input m-0 border-secondary" style={{ cursor: 'pointer', width: '1.2rem', height: '1.2rem', visibility: exige.includes('s') ? 'visible' : 'hidden' }} />
                                          </div>
                                          <div className="d-flex justify-content-center align-items-center" style={{ width: '40px' }}>
                                            <input type="checkbox" checked={st.a} onChange={() => handleToggleCheck(item.id, 'a')} className="form-check-input m-0 border-secondary" style={{ cursor: 'pointer', width: '1.2rem', height: '1.2rem', visibility: exige.includes('a') ? 'visible' : 'hidden' }} />
                                          </div>
                                      </div>
                                  </li>
                                )
                            })}
                          </ul>
                      </div>
                    </div>
                  )
              })}
            </div>
          </div>
        )}

        <footer className="mt-4 text-center text-muted small border-top pt-3 mb-2">
          <span><b>{entidadesAvaliadas}</b> avaliadas de {totalNoBanco} entidades</span> <br/>
          <span>© 2026 TD2 - Simulador de Transparência Atricon</span>
        </footer>
      </main>

      {/* ===================================================================
          MODAIS DO SISTEMA
          =================================================================== */}
      
      {/* 1. MODAL DE AJUDA */}
      <div className="modal fade" id="modalAjuda" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg">
            <div className="modal-header bg-primary text-white border-0">
              <h5 className="modal-title fw-bold"><i className="bi bi-info-circle me-2"></i> Ajuda e Legenda</h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body p-4">
              <h6 className="fw-bold mb-3">O que significam as colunas?</h6>
              <ul className="list-group list-group-flush mb-4">
                <li className="list-group-item border-0 d-flex align-items-center px-0">
                  <span className="badge bg-primary me-3" style={{ width: '30px' }}>D</span>
                  <span><b>Disponibilidade:</b> A informação está publicada no site?</span>
                </li>
                <li className="list-group-item border-0 d-flex align-items-center px-0">
                  <span className="badge bg-primary me-3" style={{ width: '30px' }}>A</span>
                  <span><b>Atualidade:</b> A informação está atualizada dentro do prazo?</span>
                </li>
                <li className="list-group-item border-0 d-flex align-items-center px-0">
                  <span className="badge bg-primary me-3" style={{ width: '30px' }}>S</span>
                  <span><b>Série Histórica:</b> Contém dados de anos anteriores?</span>
                </li>
              </ul>
              <div className="alert alert-warning border-0 small">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                <b>Critérios Essenciais (*):</b> Se um critério essencial não for atendido em todas as suas exigências, a entidade não poderá receber os selos Prata, Ouro ou Diamante.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MODAL DE CADASTRAR NOVA ENTIDADE */}
      <div className="modal fade" id="modalNovoCadastro" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg">
            <div className="modal-header bg-primary text-white border-0">
              <h5 className="modal-title fw-bold">Cadastrar Nova Entidade</h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" id="btnFecharModalNovo"></button>
            </div>
            <div className="modal-body p-4">
              <div className="mb-3">
                <label className="form-label fw-bold">Nome da Entidade *</label>
                <input type="text" className="form-control" value={novoNome} onChange={(e) => setNovoNome(e.target.value)} placeholder="Ex: PREFEITURA MUNICIPAL DE..." />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">Operador *</label>
                <select className="form-select" value={novoOperador} onChange={(e) => setNovoOperador(e.target.value)}>
                  <option value="CLEYDIR">CLEYDIR</option>
                  <option value="DAVI">DAVI</option>
                  <option value="FELIPE">FELIPE</option>
                  <option value="JOÃO">JOÃO</option>
                  <option value="KAIKE">KAIKE</option>
                  <option value="KAIRON">KAIRON</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">Controlador</label>
                <input type="text" className="form-control" value={novoControlador} onChange={(e) => setNovoControlador(e.target.value)} placeholder="Nome do controlador" />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">Telefone</label>
                <input type="text" className="form-control" value={novoTelefone} onChange={(e) => setNovoTelefone(e.target.value)} placeholder="(XX) 9XXXX-XXXX" />
              </div>
            </div>
            <div className="modal-footer border-0 pt-0">
              <button type="button" className="btn btn-light shadow-sm" data-bs-dismiss="modal">Cancelar</button>
              <button type="button" className="btn btn-primary shadow-sm fw-bold" onClick={executarCadastroModal}>Salvar Cadastro</button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MODAL DE EDITAR ENTIDADE EXISTENTE */}
      <div className="modal fade" id="modalEditarCadastro" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg">
            <div className="modal-header bg-secondary text-white border-0">
              <h5 className="modal-title fw-bold">Editar Entidade</h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" id="btnFecharModalEdit"></button>
            </div>
            <div className="modal-body p-4">
              <div className="mb-3">
                <label className="form-label fw-bold">Nome da Entidade *</label>
                <input type="text" className="form-control" value={editNome} onChange={(e) => setEditNome(e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">Operador *</label>
                <select className="form-select" value={editOperador} onChange={(e) => setEditOperador(e.target.value)}>
                  <option value="CLEYDIR">CLEYDIR</option>
                  <option value="DAVI">DAVI</option>
                  <option value="FELIPE">FELIPE</option>
                  <option value="JOÃO">JOÃO</option>
                  <option value="KAIKE">KAIKE</option>
                  <option value="KAIRON">KAIRON</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">Controlador</label>
                <input type="text" className="form-control" value={editControlador} onChange={(e) => setEditControlador(e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">Telefone</label>
                <input type="text" className="form-control" value={editTelefone} onChange={(e) => setEditTelefone(e.target.value)} />
              </div>
            </div>
            <div className="modal-footer border-0 pt-0">
              <button type="button" className="btn btn-light shadow-sm" data-bs-dismiss="modal">Cancelar</button>
              <button type="button" className="btn btn-success shadow-sm fw-bold" onClick={salvarEdicao}>Salvar Alterações</button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. MODAL DE CONFIRMAÇÃO DE EXCLUSÃO */}
      <div className="modal fade" id="modalConfirmarExclusao" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-sm">
          <div className="modal-content border-0 shadow-lg">
            <div className="modal-body p-4 text-center">
              <div className="text-danger mb-3">
                <i className="bi bi-exclamation-circle" style={{ fontSize: '3rem' }}></i>
              </div>
              <h5 className="fw-bold mb-3">Tem certeza?</h5>
              <p className="text-muted small mb-4">
                Você está prestes a excluir esta entidade. Todo o progresso de avaliação dela será perdido. Esta ação não pode ser desfeita.
              </p>
              <div className="d-flex justify-content-center gap-2">
                <button type="button" className="btn btn-light fw-bold px-4" data-bs-dismiss="modal" id="btnFecharModalExcluir">Cancelar</button>
                <button type="button" className="btn btn-danger fw-bold px-4" onClick={executarExclusao}>Sim, excluir!</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;