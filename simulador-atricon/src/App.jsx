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
            { id: "4.6", nome: "Publica informações detalhadas sobre a execution dos contratos de publicidade, com nomes dos fornecedores de completion de serviços especializados e veículos, bem como informações sobre os totais de valores pagos para cada tipo de serviço e meio de divulgação?", classificacao: "recomendada", exige: ['g', 's', 'a'] }
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
            { id: "20.9", nome: "Há transmissão de sessões ou outras formas de participation popular?", classificacao: "recomendada", exige: ['g'] },
            { id: "20.10", nome: "Divulga valores relativos às cotas para exercício da atividade parlamentar?", classificacao: "recomendada", exige: ['g', 's', 'a'] },
            { id: "20.11", nome: "Divulga dados sobre as atividades legislativas dos parlamentares?", classificacao: "recomendada", exige: ['g', 's', 'a'] }
        ]
    }
];

const DATA_ENTIDADES = [
    {n: "PREFEITURA MUNICIPAL DE MAURITI", o: "CLEYDIR", t: "8881224899", c: "Erilaila Pm Mauriti"},
    {n: "PREFEITURA MUNICIPAL DE AMONTADA", o: "CLEYDIR", t: "88999258479", c: "GLEILTON XAVIER"},
    {n: "PREFEITURA MUNICIPAL DE CAMPOS SALES", o: "CLEYDIR", t: "8893650388", c: "Emiliano Morais"},
    {n: "PREFEITURA MUNICIPAL DE SÃO BENEDITO", o: "CLEYDIR", t: "88992735249", c: "JOAO MACIEL"},
    {n: "PREFEITURA MUNICIPAL DE REDENÇÃO", o: "CLEYDIR", t: "8585640084", c: "Diego Leandro"},
    {n: "PREFEITURA MUNICIPAL DE PENTECOSTE", o: "CLEYDIR", t: "", c: ""},
    {n: "PREFEITURA MUNICIPAL DE CRATEÚS", o: "CLEYDIR", t: "88981776281", c: "BÁRBARA APOLONIO"},
    {n: "PREFEITURA MUNICIPAL DE CASCAVEL", o: "CLEYDIR", t: "8599189492", c: "Patrick"},
    {n: "PREFEITURA MUNICIPAL DE PEDRA BRANCA", o: "CLEYDIR", t: "88999762543", c: "ANTONIO BRUNO"},
    {n: "PREFEITURA MUNICIPAL DE MILHÃ", o: "CLEYDIR", t: "88998068629", c: "JOSE JACKSON"},
    {n: "PREFEITURA MUNICIPAL DE MADALENA", o: "CLEYDIR", t: "8892812540", c: "Juliano"},
    {n: "PREFEITURA MUNICIPAL DE VIÇOSA DO CEARÁ", o: "CLEYDIR", t: "88992848979", c: "FRANCISCA GISELE"},
    {n: "PREFEITURA MUNICIPAL DE MONSENHOR TABOSA", o: "CLEYDIR", t: "(88)9.9459-7640", c: "RONALDO MARÇAL"},
    {n: "PREFEITURA MUNICIPAL DE SABOEIRO", o: "CLEYDIR", t: "(88)9.8180-2572", c: "TULIO LIMA"},
    {n: "PREFEITURA MUNICIPAL DE MARTINÓPOLE", o: "CLEYDIR", t: "88 9401-0369", c: "Nathalia"},
    {n: "PREFEITURA MUNICIPAL DE JIJOCA DE JERICOACOARA", o: "CLEYDIR", t: "(88)9.9905-8234", c: "MISAEL GONSALVES"},
    {n: "PREFEITURA MUNICIPAL DE HIDROLÂNDIA", o: "CLEYDIR", t: "(85)9.9904-9838", c: "IZABEL CRISTINA"},
    {n: "PREFEITURA MUNICIPAL DE GRANJEIRO", o: "CLEYDIR", t: "(61)9.8190-5599", c: "RAIMUNDO NONATO"},
    {n: "PREFEITURA MUNICIPAL DE CARIDADE", o: "CLEYDIR", t: "+55 85 8140-2467", c: "Pedro Targino"},
    {n: "PREFEITURA MUNICIPAL DE CHORÓ", o: "CLEYDIR", t: "(88)9.8831-0397", c: "MARIA LUCIANA"},
    {n: "PREFEITURA MUNICIPAL DE CAPISTRANO", o: "CLEYDIR", t: "", c: ""},
    {n: "PREFEITURA MUNICIPAL DE BEBERIBE", o: "CLEYDIR", t: "", c: ""},
    {n: "PREFEITURA MUNICIPAL DE APUIARÉS", o: "CLEYDIR", t: "85992359860", c: ""},
    {n: "PREFEITURA MUNICIPAL DE IPAUMIRIM", o: "DAVI", t: "+55 88 9710-5818", c: "lucas"},
    {n: "PREFEITURA MUNICIPAL DE GUAIÚBA", o: "DAVI", t: "+55 88 9922-8628", c: "Ilene"},
    {n: "PREFEITURA MUNICIPAL DE GENERAL SAMPAIO", o: "DAVI", t: "+55 85 8818-9684", c: "Guiga"},
    {n: "PREFEITURA MUNICIPAL DE IPUEIRAS", o: "DAVI", t: "+55 88 8111-4498", c: "Gildazio"},
    {n: "PREFEITURA MUNICIPAL DE PALMÁCIA", o: "DAVI", t: "+55 85 9993-4383", c: "Andrezza"},
    {n: "PREFEITURA MUNICIPAL DE ITATIRA", o: "DAVI", t: "+55 88 8101-8039", c: "Edson"},
    {n: "PREFEITURA MUNICIPAL DE IPAPORANGA", o: "DAVI", t: "88 8172-4151", c: "Gustavo Gomes"},
    {n: "PREFEITURA MUNICIPAL DE IBIAPINA", o: "DAVI", t: "", c: ""},
    {n: "PREFEITURA MUNICIPAL DE ACARAPE", o: "DAVI", t: "", c: ""},
    {n: "PREFEITURA MUNICIPAL DE IPU", o: "DAVI", t: "+55 88 9967-9923", c: "Roque"},
    {n: "PREFEITURA MUNICIPAL DE SÃO GONÇALO DO AMARANTE", o: "DAVI", t: "(85)99299-4137", c: "Estácio"},
    {n: "PREFEITURA MUNICIPAL DE PARACURU", o: "DAVI", t: "+55 85 9832-8921", c: "Ricardo Martins"},
    {n: "PREFEITURA MUNICIPAL DE IBICUITINGA", o: "DAVI", t: "", c: ""},
    {n: "PREFEITURA MUNICIPAL DE AQUIRAZ", o: "DAVI", t: "+55 85 8816-0659", c: "Gaby"},
    {n: "PREFEITURA MUNICIPAL DE QUIXELÔ", o: "DAVI", t: "+55 88 9934-7397", c: "Marciana"},
    {n: "PREFEITURA MUNICIPAL DE ICÓ", o: "DAVI", t: "", c: ""},
    {n: "PREFEITURA MUNICIPAL DE CAUCAIA", o: "DAVI", t: "+55 85 8754-2703", c: "Daniel"},
    {n: "PREFEITURA MUNICIPAL DE SÃO JOÃO DO JAGUARIBE", o: "DAVI", t: "", c: ""},
    {n: "PREFEITURA MUNICIPAL DE QUITERIANÓPOLIS", o: "DAVI", t: "+55 88 9640-6953", c: "Leidaiana"},
    {n: "PREFEITURA MUNICIPAL DE PARAIPABA", o: "DAVI", t: "+55 85 9702-0850", c: "Thaiza"},
    {n: "PREFEITURA MUNICIPAL DE MERUOCA", o: "DAVI", t: "+55 88 9365-4644", c: "Tayná"},
    {n: "PREFEITURA MUNICIPAL DE URUOCA", o: "DAVI", t: "", c: ""},
    {n: "PREFEITURA MUNICIPAL DE PACAJUS", o: "DAVI", t: "+55 85 9256-0602", c: "Alice"},
    {n: "PREFEITURA MUNICIPAL DE SALITRE", o: "DAVI", t: "88 9282-8693", c: "Dr Cícero Belo"},
    {n: "PREFEITURA MUNICIPAL DE SANTANA DO ACARAÚ", o: "DAVI", t: "", c: ""},
    {n: "PREFEITURA MUNICIPAL DE CEDRO", o: "DAVI", t: "88 9787-0561", c: "Daniel Bento"},
    {n: "PREFEITURA MUNICIPAL DE ERERE", o: "FELIPE", t: "(88)9.9994-7898", c: "GIERDSON"},
    {n: "PREFEITURA MUNICIPAL DE GUARAMIRANGA", o: "FELIPE", t: "(85)9.9985-4313", c: "BRENDA UCHÔA"},
    {n: "PREFEITURA MUNICIPAL DE BATURITÉ", o: "FELIPE", t: "", c: ""},
    {n: "PREFEITURA MUNICIPAL DE COREAÚ", o: "FELIPE", t: "", c: ""},
    {n: "PREFEITURA MUNICIPAL DE IRACEMA", o: "FELIPE", t: "", c: ""},
    {n: "PREFEITURA MUNICIPAL DE ORÓS", o: "FELIPE", t: "88997854200", c: "MARCIO"},
    {n: "PREFEITURA MUNICIPAL DE IRAUÇUBA", o: "FELIPE", t: "85997645043", c: "LUCIO FLÁVIO"},
    {n: "PREFEITURA MUNICIPAL DE ACARAÚ", o: "FELIPE", t: "88994088787", c: "CAIRON FORTE"},
    {n: "PREFEITURA MUNICIPAL DE SENADOR POMPEU", o: "FELIPE", t: "88998582675", c: "CALEBE TAVARES"},
    {n: "PREFEITURA MUNICIPAL DE ITAIÇABA", o: "FELIPE", t: "(31)9.9435-6181", c: "MATHEUS SANTIAGO"},
    {n: "PREFEITURA MUNICIPAL DE EUSÉBIO", o: "FELIPE", t: "61999114748", c: "ROBERTA FROES"},
    {n: "PREFEITURA MUNICIPAL DE UMARI", o: "FELIPE", t: "88996649737", c: "FLÁVIO"},
    {n: "PREFEITURA MUNICIPAL DE UBAJARA", o: "FELIPE", t: "88997473080", c: "EDUARDO"},
    {n: "PREFEITURA MUNICIPAL DE ACOPIARA", o: "FELIPE", t: "88996411444", c: "DOIA"},
    {n: "PREFEITURA MUNICIPAL DE VARZEA ALEGRE", o: "FELIPE", t: "88994075101", c: "RAQUEL SOUSA"},
    {n: "PREFEITURA MUNICIPAL DE TAUÁ", o: "FELIPE", t: "88998044289", c: "CILANDIA MARIA"},
    {n: "PREFEITURA MUNICIPAL DE RUSSAS", o: "FELIPE", t: "88981226108", c: "GABRIELLA COSTA"},
    {n: "PREFEITURA MUNICIPAL DE TRAIRI", o: "FELIPE", t: "85999185388", c: "Virgenio"},
    {n: "PREFEITURA MUNICIPAL DE TAMBORIL", o: "FELIPE", t: "88981239248", c: "Wilson"},
    {n: "PREFEITURA MUNICIPAL DE MOMBAÇA", o: "FELIPE", t: "(88)9.8880-0889", c: "LUCAS CASTRO"},
    {n: "PREFEITURA MUNICIPAL DE JARDIM", o: "FELIPE", t: "88988626662", c: "SAVIO"},
    {n: "PREFEITURA MUNICIPAL DE DEP. IRAPUAN PINHEIRO", o: "FELIPE", t: "", c: ""},
    {n: "PREFEITURA MUNICIPAL DE URUBURETAMA", o: "FELIPE", t: "", c: "CLEYSON"},
    {n: "PREFEITURA MUNICIPAL DE LAVRAS DA MANGABEIRA", o: "FELIPE", t: "88994988132", c: "ERBERSON LEMOS"},
    {n: "PREFEITURA MUNICIPAL DE FRECHEIRINHA", o: "FELIPE", t: "88994147991", c: "LEILA"},
    {n: "PREFEITURA MUNICIPAL DE BAIXIO", o: "FELIPE", t: "88996786652", c: "beto farias"},
    {n: "PREFEITURA MUNICIPAL DE CRATO", o: "JOÃO", t: "88 8123-2317", c: "Júlio César"},
    {n: "PREFEITURA MUNICIPAL DE QUIXERAMOBIM", o: "JOÃO", t: "", c: ""},
    {n: "SECRETARIA DE EDUCACAO DE JAGUARETAMA", o: "JOÃO", t: "", c: ""},
    {n: "PREFEITURA MUNICIPAL DE ITAPIUNA", o: "JOÃO", t: "", c: ""},
    {n: "PREFEITURA MUNICIPAL DE MORRINHOS", o: "JOÃO", t: "88 9742-7966", c: "NAIARA"},
    {n: "PREFEITURA MUNICIPAL DE ARACATI", o: "JOÃO", t: "85 9698-5272", c: "MARIANA"},
    {n: "PREFEITURA MUNICIPAL DE VARJOTA", o: "JOÃO", t: "88 9680-3943", c: "Guilherme Paiva"},
    {n: "PREFEITURA MUNICIPAL DE OCARA", o: "JOÃO", t: "85 9277-2032", c: "WELYSSON"},
    {n: "PREFEITURA MUNICIPAL DE MASSAPÊ", o: "JOÃO", t: "88 9785-6104", c: "MARCIO"},
    {n: "PREFEITURA MUNICIPAL DE LIMOEIRO DO NORTE", o: "JOÃO", t: "88 8156-2249", c: "Marden"},
    {n: "PREFEITURA MUNICIPAL DE ALTANEIRA", o: "JOÃO", t: "88 9414-4994", c: "Virley Batista"},
    {n: "PREFEITURA MUNICIPAL DE GRAÇA", o: "JOÃO", t: "(88)9.9295-7709", c: "ANTONIA BARBARA"},
    {n: "PREFEITURA MUNICIPAL DE PARAMOTI", o: "JOÃO", t: "88 8877-6829", c: "Marcos Soares"},
    {n: "PREFEITURA MUNICIPAL DE MORADA NOVA", o: "JOÃO", t: "88 9654-4900", c: "Benegildo Cruz"},
    {n: "PREFEITURA MUNICIPAL DE HORIZONTE", o: "JOÃO", t: "85 9196-5902", c: "Fabricio"},
    {n: "PREFEITURA MUNICIPAL DE GRANJA", o: "JOÃO", t: "88 9370-1074", c: "Edvando Aragão"},
    {n: "PREFEITURA MUNICIPAL DE FORQUILHA", o: "JOÃO", t: "88 9232-7305", c: "Edgleison"},
    {n: "PREFEITURA MUNICIPAL DE PINDORETAMA", o: "JOÃO", t: "88 9755-9233", c: "LEO"},
    {n: "PREFEITURA MUNICIPAL DE NOVA RUSSAS", o: "JOÃO", t: "88 8220-0809", c: "Matheus Farias"},
    {n: "PREFEITURA MUNICIPAL DE ITAPAJÉ", o: "JOÃO", t: "85 9290-2523", c: ""},
    {n: "PREFEITURA MUNICIPAL DE TURURU", o: "JOÃO", t: "85 8501-6489", c: ""},
    {n: "PREFEITURA MUNICIPAL DE SANTA QUITÉRIA", o: "JOÃO", t: "", c: ""},
    {n: "PREFEITURA MUNICIPAL DE MARANGUAPE", o: "JOÃO", t: "85 8894-8445", c: "Helio"},
    {n: "PREFEITURA MUNICIPAL DE CANINDÉ", o: "JOÃO", t: "(85) 98208-8515", c: "Marcos Salmo"},
    {n: "PREFEITURA MUNICIPAL DE AURORA", o: "JOÃO", t: "88999450180", c: "Raquel Toquarto"},
    {n: "PREFEITURA MUNICIPAL DE ICAPUÍ", o: "KAIKE", t: "88981128848", c: "LUCAS DAVI"},
    {n: "PREFEITURA MUNICIPAL DE PEREIRO", o: "KAIKE", t: "88996649737", c: ""},
    {n: "PREFEITURA MUNICIPAL DE QUIXERÉ", o: "KAIKE", t: "84998190325", c: "Taymara"},
    {n: "PREFEITURA MUNICIPAL DE POTENGI", o: "KAIKE", t: "88 9489-7096", c: "Herllon"},
    {n: "PREFEITURA MUNICIPAL DE CATARINA", o: "KAIKE", t: "", c: ""},
    {n: "PREFEITURA MUNICIPAL DE ARATUBA", o: "KAIKE", t: "85998166106", c: "Alan Santos"},
    {n: "PREFEITURA MUNICIPAL DE QUIXADA", o: "KAIKE", t: "", c: ""},
    {n: "PREFEITURA MUNICIPAL DE JAGUARETAMA", o: "KAIKE", t: "88 8106-2747", c: "LARA"},
    {n: "PREFEITURA MUNICIPAL DE PORANGA", o: "KAIKE", t: "8596083273", c: "dacio+"},
    {n: "PREFEITURA MUNICIPAL DE CARNAUBAL", o: "KAIKE", t: "", c: ""},
    {n: "PREFEITURA MUNICIPAL DE ARACOIABA", o: "KAIKE", t: "85 9626-4604", c: "bianca"},
    {n: "PREFEITURA MUNICIPAL DE ITAPIPOCA", o: "KAIKE", t: "85 9855-0245", c: "alexadrina"},
    {n: "PREFEITURA MUNICIPAL DE AIUABA", o: "KAIKE", t: "88 9348-6586", c: "BRUNA"},
    {n: "PREFEITURA MUNICIPAL DE TIANGUÁ", o: "KAIKE", t: "88 9404-2405", c: "Julio Fidelis"},
    {n: "PREFEITURA MUNICIPAL DE JUAZEIRO DO NORTE", o: "KAIKE", t: "88 9482-9814", c: "DUDA"},
    {n: "PREFEITURA MUNICIPAL DE ITAREMA", o: "KAIKE", t: "88 8111-5393", c: "eduardo"},
    {n: "PREFEITURA MUNICIPAL DE ITAITINGA", o: "KAIKE", t: "", c: ""},
    {n: "PREFEITURA MUNICIPAL DE FORTIM", o: "KAIKE", t: "(88)9.8879-2867", c: "cinthia"},
    {n: "PREFEITURA MUNICIPAL DE PACOTI", o: "KAIKE", t: "85 99285-3692", c: "Frederico"},
    {n: "PREFEITURA MUNICIPAL DE MARCO", o: "KAIKE", t: "", c: ""},
    {n: "PREFEITURA MUNICIPAL DE BARBALHA", o: "KAIKE", t: "", c: ""},
    {n: "PREFEITURA MUNICIPAL DE ASSARÉ", o: "KAIKE", t: "88994992156", c: "Jaqueline"},
    {n: "PREFEITURA MUNICIPAL DE JAGUARUANA", o: "KAIKE", t: "85 9865-2960", c: "BRENA"},
    {n: "PREFEITURA MUNICIPAL DE CATUNDA", o: "KAIKE", t: "", c: ""},
    {n: "PREFEITURA MUNICIPAL DE BELA CRUZ", o: "KAIRON", t: "88992562845", c: "Fabricio"},
    {n: "PREFEITURA MUNICIPAL DE BOA VIAGEM", o: "KAIRON", t: "88 9960-7757", c: "Fabricio"},
    {n: "PREFEITURA MUNICIPAL DE ALTO SANTO", o: "KAIRON", t: "88 9430-8147", c: "Wanderson"},
    {n: "PREFEITURA MUNICIPAL DE PIQUET CARNEIRO", o: "KAIRON", t: "88997101381", c: "Samara"},
    {n: "PREFEITURA MUNICIPAL DE PALHANO", o: "KAIRON", t: "88997108664", c: "Danylo"},
    {n: "PREFEITURA MUNICIPAL DE INDEPENDENCIA", o: "KAIRON", t: "85999632215", c: ""},
    {n: "PREFEITURA MUNICIPAL DE TEJUÇUOCA", o: "KAIRON", t: "(85)9.9222-9767", c: "LARA"},
    {n: "PREFEITURA MUNICIPAL DE SANTANA DO CARIRI", o: "KAIRON", t: "85 9829-8980", c: "Viviane"},
    {n: "PREFEITURA MUNICIPAL DE POTIRETAMA", o: "KAIRON", t: "88 92166-7094", c: "Eliane"},
    {n: "PREFEITURA MUNICIPAL DE NOVO ORIENTE", o: "KAIRON", t: "85 9219-8776", c: "Toribio Nogueira"},
    {n: "PREFEITURA MUNICIPAL DE MIRAÍMA", o: "KAIRON", t: "85 9160-9069", c: "Raimundo"},
    {n: "PREFEITURA MUNICIPAL DE MILAGRES", o: "KAIRON", t: "88992286639", c: ""},
    {n: "PREFEITURA MUNICIPAL DE GUARACIABA DO NORTE", o: "KAIRON", t: "88992074236", c: "Cilas"},
    {n: "PREFEITURA MUNICIPAL DE CARIRIAÇU", o: "KAIRON", t: "88 9647-9869", c: "Jhonatan"},
    {n: "PREFEITURA MUNICIPAL DE BARREIRA", o: "KAIRON", t: "85 9609-6115", c: "Fernando"},
    {n: "PREFEITURA MUNICIPAL DE TABULEIRO DO NORTE", o: "KAIRON", t: "88 9950-2020", c: "Rafael"},
    {n: "PREFEITURA MUNICIPAL DE SOLONÓPOLE", o: "KAIRON", t: "(88)9.9918-9652", c: "MARIA VILANEIDE"},
    {n: "PREFEITURA MUNICIPAL DE JAGUARIBE", o: "KAIRON", t: "(88)9.9727-4962", c: "CARLUCIA ANGELICA"},
    {n: "PREFEITURA MUNICIPAL DE CARIRÉ", o: "KAIRON", t: "88981213743", c: ""},
    {n: "PREFEITURA MUNICIPAL DE PACATUBA", o: "KAIRON", t: "85 8160-3842", c: "Tamise"},
    {n: "PREFEITURA MUNICIPAL DE BARRO", o: "KAIRON", t: "88 9826-0863", c: "Paulo"},

    {n:"CÂMARA MUNICIPAL DE ACARAPE", o:"CLEYDIR", t:"", c:""},
    {n:"CAMARA MUNICIPAL DE ARARENDA", o:"CLEYDIR", t:"", c:""},
    {n:"CÂMARA MUNICIPAL DE ASSARÉ", o:"CLEYDIR", t:"", c:""},
    {n:"CÂMARA MUNICIPAL DE CARIRÉ", o:"CLEYDIR", t:"", c:""},
    {n:"CÂMARA MUNICIPAL DE ERERÉ", o:"CLEYDIR", t:"", c:""},
    {n:"CÂMARA MUNICIPAL DE GRANJA", o:"CLEYDIR", t:"", c:""},
    {n:"CÂMARA MUNICIPAL DE ICÓ", o:"CLEYDIR", t:"+55 88 9995-0999", c:"César gregório"},
    {n:"CÂMARA MUNICIPAL DE JARDIM", o:"CLEYDIR", t:"", c:""},
    {n:"CÂMARA MUNICIPAL DE MONSENHOR TABOSA", o:"CLEYDIR", t:"", c:""},
    {n:"CÂMARA MUNICIPAL DE MORADA NOVA", o:"CLEYDIR", t:"", c:""},
    {n:"CÂMARA MUNICIPAL DE ORÓS", o:"CLEYDIR", t:"", c:""},
    {n:"CÂMARA MUNICIPAL DE AIUABA", o:"DAVI", t:"+55 88 9823-4060", c:"Pedro Luan"},
    {n:"CÂMARA MUNICIPAL DE ARARIPE", o:"DAVI", t:"", c:""},
    {n:"CÂMARA MUNICIPAL DE PACAJUS", o:"DAVI", t:"", c:""},
    {n:"CÂMARA MUNICIPAL DE PACATUBA", o:"DAVI", t:"", c:""},
    {n:"CÂMARA MUNICIPAL DE PEDRA BRANCA", o:"DAVI", t:"+55 88 8879-3846", c:"Joao Paulo"},
    {n:"CÂMARA MUNICIPAL DE PEREIRO", o:"DAVI", t:"+55 88 9664-9737", c:"Flavio"},
    {n:"CÂMARA MUNICIPAL DE POTENGI", o:"DAVI", t:"", c:""},
    {n:"CÂMARA MUNICIPAL DE POTIRETAMA", o:"DAVI", t:"+55 88 9608-0740", c:"Elizelda"},
    {n:"CÂMARA MUNICIPAL DE SABOEIRO", o:"DAVI", t:"+55 88 8120-0430", c:"Juninho Feitosa"},
    {n:"CÂMARA MUNICIPAL DE VARZEA ALEGRE", o:"DAVI", t:"+55 88 9995-099", c:"Cézar gregório"},
    {n:"CÂMARA MUNICIPAL DE BATURITÉ", o:"CLEYDIR", t:"", c:""},
    {n:"CÂMARA MUNICIPAL DE CEDRO", o:"FELIPE", t:"(88)9.9933-8875", c:"Ana"},
    {n:"CÂMARA MUNICIPAL DE GENERAL SAMPAIO", o:"DAVI", t:"85992990133", c:"kêtila"},
    {n:"CÂMARA MUNICIPAL DE IPU", o:"KAIRON", t:"", c:""},
    {n:"CÂMARA MUNICIPAL DE ITAPIPOCA", o:"FELIPE", t:"", c:""},
    {n:"CÂMARA MUNICIPAL DE JIJOCA DE JERICOACOARA", o:"JOÃO", t:"88 9767-2586", c:"Erika"},
    {n:"CÂMARA MUNICIPAL DE LIMOEIRO DO NORTE", o:"DAVI", t:"88996384559", c:"João"},
    {n:"CÂMARA MUNICIPAL DE MILAGRES", o:"KAIKE", t:"", c:""},
    {n:"CÂMARA MUNICIPAL DE PENTECOSTE", o:"KAIRON", t:"85 9161-4810", c:"Paulo Henrique"},
    {n:"CÂMARA MUNICIPAL DE QUIXELÔ", o:"JOÃO", t:"(88)9.9905-0212", c:"ARIANNE DE LIMA"},
    {n:"CÂMARA MUNICIPAL DE SALITRE", o:"DAVI", t:"88992768261", c:"Huan"},
    {n:"CÂMARA MUNICIPAL DE ALTANEIRA", o:"FELIPE", t:"(88)9.9734-4503", c:"MARCOS JOSÉ"},
    {n:"CAMARA MUNICIPAL DE AQUIRAZ", o:"FELIPE", t:"85986513262", c:"Ianara Mota"},
    {n:"CÂMARA MUNICIPAL DE CAMOCIM", o:"FELIPE", t:"(88)9.9215-3122", c:"FRANCISCO HELTON"},
    {n:"CÂMARA MUNICIPAL DE HIDROLÂNDIA", o:"FELIPE", t:"(85)9.9787-5253", c:"Junior Martins"},
    {n:"CÂMARA MUNICIPAL DE LAVRAS DA MANGABEIRA", o:"FELIPE", t:"(88)9.9767-4785", c:"BRUNO JONATAS"},
    {n:"CÂMARA MUNICIPAL DE MADALENA", o:"FELIPE", t:"(88)9.9341-6922", c:"HELÁDIO ALVES"},
    {n:"CÂMARA MUNICIPAL DE MAURITI", o:"FELIPE", t:"", c:""},
    {n:"CÂMARA MUNICIPAL DE NOVO ORIENTE", o:"FELIPE", t:"88997347973", c:"Francisco nailson"},
    {n:"CÂMARA MUNICIPAL DE SÃO BENEDITO", o:"FELIPE", t:"88999960183", c:"STEFANY MARTINS"},
    {n:"CÂMARA MUNICIPAL DE SOBRAL", o:"FELIPE", t:"(85)9.9739-4342", c:"ANTONIA DANIELLE"},
    {n:"CÂMARA MUNICIPAL DE UMARI", o:"FELIPE", t:"(83)9.8196-7391", c:"CLEDIANO MARK"},
    {n:"CÂMARA MUNICIPAL DE AMONTADA", o:"JOÃO", t:"88 9925-8479", c:"Gleilton Xavier"},
    {n:"CÂMARA MUNICIPAL DE APUIARÉS", o:"JOÃO", t:"85 9402-9881", c:"Juliane Santiago"},
    {n:"CÂMARA MUNICIPAL DE AURORA", o:"JOÃO", t:"88992616605", c:"DANIEL GUSTAVO"},
    {n:"CÂMARA MUNICIPAL DE BAIXIO", o:"JOÃO", t:"", c:""},
    {n:"CÂMARA MUNICIPAL DE BARBALHA", o:"JOÃO", t:"88 8155-1008", c:"Tiago Pereira"},
    {n:"CÂMARA MUNICIPAL DE BARREIRA", o:"JOÃO", t:"", c:""},
    {n:"CÂMARA MUNICIPAL DE FORTIM - CE", o:"JOÃO", t:"88 9855-9412", c:"EMANUEL"},
    {n:"CÂMARA MUNICIPAL DE IPAUMIRIM", o:"JOÃO", t:"8899975-3351", c:"Salomão"},
    {n:"CÂMARA MUNICIPAL DE MARACANAÚ", o:"JOÃO", t:"85988923546", c:"anne Katherine"},
    {n:"CÂMARA MUNICIPAL DE MIRAÍMA", o:"JOÃO", t:"8899278-3299", c:"Aline Custodio"},
    {n:"CÂMARA MUNICIPAL DE MISSÃO VELHA", o:"JOÃO", t:"88996671013", c:"moisés saraiva"},
    {n:"CÂMARA MUNICIPAL DE TRAIRI", o:"JOÃO", t:"", c:""},
    {n:"CÂMARA MUNICIPAL DE CAMPOS SALES", o:"KAIKE", t:"", c:""},
    {n:"CÂMARA MUNICIPAL DE ICAPUÍ", o:"KAIKE", t:"(88)981773635", c:"LUÍS FILIPE LIMA"},
    {n:"CÂMARA MUNICIPAL DE INDEPENDÊNCIA", o:"KAIKE", t:"88 9802-9505", c:"cezar Gustavo"},
    {n:"CÂMARA MUNICIPAL DE IPAPORANGA", o:"KAIKE", t:"8899618-7678", c:"chaguinha"},
    {n:"CÂMARA MUNICIPAL DE ITAITINGA", o:"KAIKE", t:"", c:""},
    {n:"CÂMARA MUNICIPAL DE MARCO", o:"KAIKE", t:"88999419962", c:"ALEXANDRA MARIA"},
    {n:"CÂMARA MUNICIPAL DE TAUÁ", o:"KAIKE", t:"85981597498", c:"HYGOR PINHEIRO"},
    {n:"CÂMARA MUNICIPAL DE TURURU", o:"KAIKE", t:"88 9607-7460", c:"marilia"},
    {n:"CÂMARA MUNICIPAL DE URUOCA", o:"KAIKE", t:"(88)9.8224-3813", c:"DUDA"},
    {n:"CÂMARA MUNICIPAL DE VIÇOSA DO CEARA", o:"KAIKE", t:"88 9995-0999", c:"cezar"},
    {n:"CÂMARA MUNICIPAL DE ARACOIABA", o:"KAIRON", t:"", c:""},
    {n:"CÂMARA MUNICIPAL DE CAPISTRANO", o:"KAIRON", t:"", c:""},
    {n:"CÂMARA MUNICIPAL DE CARIDADE", o:"KAIRON", t:"", c:""},
    {n:"CÂMARA MUNICIPAL DE CHORÓ", o:"KAIRON", t:"", c:""},
    {n:"CÂMARA MUNICIPAL DE CRUZ", o:"KAIRON", t:"", c:""},
    {n:"CÂMARA MUNICIPAL DE GRANJEIRO", o:"KAIRON", t:"", c:""},
    {n:"CÂMARA MUNICIPAL DE GUARAMIRANGA", o:"KAIRON", t:"", c:""},
    {n:"CÂMARA MUNICIPAL DE MORRINHOS", o:"KAIRON", t:"", c:""},
    {n:"CÂMARA MUNICIPAL DE PALHANO", o:"KAIRON", t:"88997108664", c:"Danylo"},
    {n:"CÂMARA MUNICIPAL DE PORANGA", o:"KAIRON", t:"", c:""}
];

function normalizarTexto(texto) {
    if (!texto) return "";
    return texto.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
}

function verificaSeAtende(item, marcados) {
    const s = marcados[item.id] || {g:false, s:false, a:false};
    const exige = item.exige || ['g', 's', 'a'];
    let atende = true;
    if (exige.includes('g') && !s.g) atende = false;
    if (exige.includes('s') && !s.s) atende = false;
    if (exige.includes('a') && !s.a) atende = false;
    return atende;
}

function App() {

  const [usuarioLogado, setUsuarioLogado] = useState(false);
  const [carregandoLogin, setCarregandoLogin] = useState(true); 
  const [loginUser, setLoginUser] = useState("");
  const [loginSenha, setLoginSenha] = useState("");
  const [loginErro, setLoginErro] = useState("");
  const [modoCadastro, setModoCadastro] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);
  const [submenuTabelasAberto, setSubmenuTabelasAberto] = useState(false);
  const [submenuRelatoriosAberto, setSubmenuRelatoriosAberto] = useState(false);

  const [bancoDeDados, setBancoDeDados] = useState({});
  const [dadosCarregadosDaNuvem, setDadosCarregadosDaNuvem] = useState(false);
  const [tipoTabela, setTipoTabela] = useState('');

  const [temaEscuro, setTemaEscuro] = useState(() => {
      return localStorage.getItem('temaAtricon') === 'escuro';
  });

  const [filtroRelatorio, setFiltroRelatorio] = useState('todos');

  // Estados do Modal Gerencial de Relatórios
  const [relTipo, setRelTipo] = useState('todos');
  const [relValor, setRelValor] = useState('todos');
  const [dadosRelatorioAgrupado, setDadosRelatorioAgrupado] = useState([]);

  useEffect(() => {
      setRelValor('todos');
  }, [relTipo]);

  useEffect(() => {
      if (temaEscuro) {
          document.documentElement.setAttribute('data-bs-theme', 'dark');
          localStorage.setItem('temaAtricon', 'escuro');
      } else {
          document.documentElement.setAttribute('data-bs-theme', 'light');
          localStorage.setItem('temaAtricon', 'claro');
      }
  }, [temaEscuro]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
            setUsuarioLogado(true);
            try {
                const docRef = doc(db, "sistema", "bancoGeral");
                const docSnap = await getDoc(docRef);
                
                if (docSnap.exists()) {
                    const dadosAtuais = docSnap.data();
                    let precisaAtualizar = false;

                    DATA_ENTIDADES.forEach(item => {
                        const id = "ENT_" + item.n.replace(/\s/g, "_");
                        if (!dadosAtuais[id]) {
                            dadosAtuais[id] = { id: id, nome: item.n, operador: item.o, controlador: item.c || "", telefone: item.t || "", logo: "", perc: 0, selo: "INEXISTENTE", marcados: {} };
                            precisaAtualizar = true;
                        } else {
                            if (item.c && dadosAtuais[id].controlador !== item.c) {
                                dadosAtuais[id].controlador = item.c;
                                precisaAtualizar = true;
                            }
                            if (item.t && dadosAtuais[id].telefone !== item.t) {
                                dadosAtuais[id].telefone = item.t;
                                precisaAtualizar = true;
                            }
                            if (dadosAtuais[id].logo === undefined) {
                                dadosAtuais[id].logo = "";
                                precisaAtualizar = true;
                            }
                        }
                    });

                    setBancoDeDados(dadosAtuais);
                    if(precisaAtualizar) await setDoc(docRef, dadosAtuais);

                } else {
                    let dbInicial = {};
                    DATA_ENTIDADES.forEach(item => {
                        const id = "ENT_" + item.n.replace(/\s/g, "_");
                        dbInicial[id] = { id: id, nome: item.n, operador: item.o, controlador: item.c || "", telefone: item.t || "", logo: "", perc: 0, selo: "INEXISTENTE", marcados: {} };
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

  const [novoNome, setNovoNome] = useState("");
  const [novoOperador, setNovoOperador] = useState("CLEYDIR");
  const [novoControlador, setNovoControlador] = useState("");
  const [novoTelefone, setNovoTelefone] = useState("");
  const [novoLogo, setNovoLogo] = useState("");

  const [idEdicao, setIdEdicao] = useState(null);
  const [editNome, setEditNome] = useState("");
  const [editOperador, setEditOperador] = useState("");
  const [editControlador, setEditControlador] = useState("");
  const [editTelefone, setEditTelefone] = useState("");
  const [editLogo, setEditLogo] = useState("");
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

  const abrirTabela = (tipo) => {
      setTipoTabela(tipo);
      setTelaAtiva('tabela');
      setMenuAberto(false);
      window.scrollTo(0,0);
  };

  const getDadosTabela = () => {
      let arr = Object.values(bancoDeDados);
      if (tipoTabela === 'prefeituras') {
          arr = arr.filter(e => normalizarTexto(e.nome).includes('prefeitura'));
      } else if (tipoTabela === 'camaras') {
          arr = arr.filter(e => normalizarTexto(e.nome).includes('camara'));
      } else if (tipoTabela === 'controladores') {
          arr = arr.filter(e => e.controlador && e.controlador.trim() !== "");
      }

      const termoNorm = normalizarTexto(termoBusca);
      arr = arr.filter(e => {
          const passaTexto = normalizarTexto(e.nome).includes(termoNorm) || (e.controlador && normalizarTexto(e.controlador).includes(termoNorm));
          const passaOperador = (filtroOperador === 'todos') || (e.operador === filtroOperador);
          const passaSelo = (filtroSelo === 'todos') || (e.selo === filtroSelo);
          return passaTexto && passaOperador && passaSelo;
      });

      if (tipoTabela === 'controladores') {
          arr.sort((a,b) => a.controlador.localeCompare(b.controlador));
      } else {
          arr.sort((a,b) => a.nome.localeCompare(b.nome));
      }
      return arr;
  };

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
              alert("Erro: O arquivo selecionado não é JSON válido.");
          }
          event.target.value = null; 
      };
      reader.readAsText(file);
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
                              telefone: telefone, logo: "", perc: 0, selo: "INEXISTENTE", marcados: {}
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
  };

  const getDadosFiltradosAgrupamento = () => {
      let dados = Object.values(bancoDeDados);
      if (relTipo === 'operador' && relValor !== 'todos') {
          dados = dados.filter(e => e.operador === relValor);
      } else if (relTipo === 'selo' && relValor !== 'todos') {
          dados = dados.filter(e => e.selo === relValor);
      } else if (relTipo === 'controlador' && relValor !== 'todos') {
          if (relValor === 'com') dados = dados.filter(e => e.controlador && e.controlador.trim() !== "");
          if (relValor === 'sem') dados = dados.filter(e => !e.controlador || e.controlador.trim() === "");
      } else if (relTipo === 'poder' && relValor !== 'todos') {
          if (relValor === 'executivo') dados = dados.filter(e => normalizarTexto(e.nome).includes('prefeitura'));
          if (relValor === 'legislativo') dados = dados.filter(e => normalizarTexto(e.nome).includes('camara'));
      }
      dados.sort((a,b) => a.nome.localeCompare(b.nome));
      return dados;
  };

  const gerarRelatorioGerencialCSV = () => {
      const dados = getDadosFiltradosAgrupamento();
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "ID;Nome da Entidade;Operador;Controlador;Telefone;Progresso (%);Selo Atual\n"; 
      
      dados.forEach(ent => {
          const nomeLimpo = ent.nome.replace(/;/g, ",").replace(/"/g, "");
          const ctrlLimpo = (ent.controlador || "").replace(/;/g, ",");
          const row = `${ent.id};"${nomeLimpo}";${ent.operador};"${ctrlLimpo}";${ent.telefone || ""};${ent.perc};${ent.selo}`;
          csvContent += row + "\n";
      });
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `relatorio_${relTipo}_atricon_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setMenuAberto(false);
  };

  const gerarRelatorioGerencialPDF = () => {
      const dados = getDadosFiltradosAgrupamento();
      setDadosRelatorioAgrupado(dados);
      setMenuAberto(false);
      
      setTimeout(() => {
          setTelaAtiva('relatorio_agrupado');
          window.scrollTo(0,0);
          
          setTimeout(() => { 
              window.print(); 
          }, 500);
      }, 400);
  };

  const baixarModeloCSV = () => {
      const csvContent = "data:text/csv;charset=utf-8,"
          + "ID;Nome da Entidade;Operador;Controlador;Telefone\n"
          + "ENT_NOME_DA_ENTIDADE_1;\"PREFEITURA MUNICIPAL EXEMPLO\";CLEYDIR;\"NOME DO CONTROLADOR\";85999999999\n"
          + "ENT_NOME_DA_ENTIDADE_2;\"CAMARA MUNICIPAL EXEMPLO\";DAVI;;";

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "modelo_importacao_atricon.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      setMenuAberto(false);
  };

  const handleUploadLogoNova = (e) => {
      const file = e.target.files[0];
      if (file) {
          if (file.size > 500 * 1024) {
              alert("A imagem é muito grande! Escolha um brasão de até 500KB para não sobrecarregar o sistema.");
              e.target.value = null;
              return;
          }
          const reader = new FileReader();
          reader.onload = (event) => setNovoLogo(event.target.result);
          reader.readAsDataURL(file);
      }
  };

  const handleUploadLogoEdit = (e) => {
      const file = e.target.files[0];
      if (file) {
          if (file.size > 500 * 1024) {
              alert("A imagem é muito grande! Escolha um brasão de até 500KB para não sobrecarregar o sistema.");
              e.target.value = null;
              return;
          }
          const reader = new FileReader();
          reader.onload = (event) => setEditLogo(event.target.result);
          reader.readAsDataURL(file);
      }
  };

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
              telefone: novoTelefone, logo: novoLogo, perc: 0, selo: "INEXISTENTE", marcados: {}
          };
          return newDb;
      });
      setNovoNome(""); setNovoOperador("CLEYDIR"); setNovoControlador(""); setNovoTelefone(""); setNovoLogo("");
      document.getElementById('btnFecharModalNovo').click();
  };

  const prepararEdicao = (id) => {
      const ent = bancoDeDados[id];
      setIdEdicao(id); setEditNome(ent.nome); setEditOperador(ent.operador);
      setEditControlador(ent.controlador || ""); setEditTelefone(ent.telefone || ""); setEditLogo(ent.logo || "");
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
          newDb[idEdicao] = { ...newDb[idEdicao], nome: nomeFinal, operador: editOperador, controlador: editControlador, telefone: editTelefone, logo: editLogo };
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

  const imprimirPDF = () => {
      setTimeout(() => { window.print(); }, 400);
  };

  const finalizarAvaliacao = async () => {
      try {
          await setDoc(doc(db, "sistema", "bancoGeral"), bancoDeDados);
          alert("Avaliação salva e sincronizada com sucesso! ✅");
          setTelaAtiva('lista');
          setEntidadeEditando(null);
          window.scrollTo(0,0);
      } catch (e) {
          alert("Erro ao salvar a avaliação.");
          console.error(e);
      }
  };

  if (carregandoLogin || (usuarioLogado && !dadosCarregadosDaNuvem)) {
      return (
          <div className="d-flex flex-column align-items-center justify-content-center vh-100" style={{ backgroundColor: 'var(--bg-pagina)' }}>
              <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}></div>
              <h5 className="fw-bold text-muted">Sincronizando com a nuvem... ☁️</h5>
          </div>
      ); 
  }

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
                                  <span className="input-group-text bg-transparent border-end-0"><i className="bi bi-envelope text-body"></i></span>
                                  <input type="email" className="form-control bg-transparent text-body border-start-0 ps-0" placeholder="Digite seu e-mail" value={loginUser} onChange={(e) => setLoginUser(e.target.value)} required />
                              </div>
                          </div>
                          <div className="mb-4">
                              <label className="form-label fw-bold text-muted small">Senha</label>
                              <div className="input-group shadow-sm">
                                  <span className="input-group-text bg-transparent border-end-0"><i className="bi bi-key text-body"></i></span>
                                  <input type="password" className="form-control bg-transparent text-body border-start-0 ps-0" placeholder="••••••••" value={loginSenha} onChange={(e) => setLoginSenha(e.target.value)} required />
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

  return (
    <>
      <button onClick={() => setMenuAberto(true)} className="btn-menu-lateral border-0 shadow-sm d-print-none">
        <i className="bi bi-list fs-4"></i>
      </button>

      {menuAberto && (
        <div className="modal-backdrop fade show d-print-none" onClick={() => setMenuAberto(false)} style={{ zIndex: 1040 }}></div>
      )}
      
      <div id="sidebar" className={`${menuAberto ? 'active' : ''} d-print-none`} style={{ zIndex: 1050, overflowY: 'auto' }}>
        <div className="p-4 d-flex flex-column min-vh-100">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="fw-bold text-primary m-0"><i className="bi bi-grid-1x2-fill me-2"></i> Menu</h5>
            <button onClick={() => setMenuAberto(false)} className="btn btn-light btn-sm rounded-circle border shadow-sm" id="btnCloseSidebar">
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
          
          <div className="d-flex flex-column gap-2 mb-4">
            <button 
              className="btn btn-light text-start fw-bold p-3 border shadow-sm d-flex justify-content-between align-items-center" 
              onClick={() => setSubmenuTabelasAberto(!submenuTabelasAberto)}
            >
              <span><i className="bi bi-table me-2 text-primary"></i> Tabelas</span>
              <i className={`bi bi-chevron-${submenuTabelasAberto ? 'up' : 'down'} text-muted`}></i>
            </button>

            {submenuTabelasAberto && (
              <div className="d-flex flex-column gap-2 ms-3 border-start ps-2">
                <button className="btn btn-light text-start fw-bold p-2 shadow-sm" onClick={() => abrirTabela('prefeituras')}>
                  <i className="bi bi-building me-2 text-secondary"></i> Prefeituras
                </button>
                <button className="btn btn-light text-start fw-bold p-2 shadow-sm" onClick={() => abrirTabela('camaras')}>
                  <i className="bi bi-bank me-2 text-secondary"></i> Câmaras
                </button>
                <button className="btn btn-light text-start fw-bold p-2 shadow-sm" onClick={() => abrirTabela('controladores')}>
                  <i className="bi bi-people me-2 text-secondary"></i> Controladores
                </button>
              </div>
            )}

            <button 
              className="btn btn-light text-start fw-bold p-3 border shadow-sm d-flex justify-content-between align-items-center mt-2" 
              onClick={() => setSubmenuRelatoriosAberto(!submenuRelatoriosAberto)}
            >
              <span><i className="bi bi-file-earmark-bar-graph me-2 text-success"></i> Relatórios e Backup</span>
              <i className={`bi bi-chevron-${submenuRelatoriosAberto ? 'up' : 'down'} text-muted`}></i>
            </button>

            {submenuRelatoriosAberto && (
              <div className="d-flex flex-column gap-2 ms-3 border-start ps-2">
                <button className="btn btn-light text-start fw-bold p-2 shadow-sm text-primary" data-bs-toggle="modal" data-bs-target="#modalRelatoriosGerenciais">
                  <i className="bi bi-funnel me-2"></i> Relatório por agrupamento
                </button>
                
                <hr className="my-2 text-muted" />
                
                <button className="btn btn-light text-start fw-bold p-2 shadow-sm text-success" onClick={exportarJSON}>
                  <i className="bi bi-download me-2"></i> Exportar Dados (JSON)
                </button>
                <button className="btn btn-light text-start fw-bold p-2 shadow-sm text-success" onClick={() => document.getElementById('importarJsonInput').click()}>
                  <i className="bi bi-upload me-2"></i> Importar Dados (JSON)
                </button>
                <input type="file" id="importarJsonInput" accept=".json" style={{ display: 'none' }} onChange={importarJSON} />

                <button className="btn btn-light text-start fw-bold p-2 shadow-sm text-secondary" onClick={() => document.getElementById('importarCsvInput').click()}>
                  <i className="bi bi-file-earmark-arrow-up me-2"></i> Importar do Excel (CSV)
                </button>
                <input type="file" id="importarCsvInput" accept=".csv" style={{ display: 'none' }} onChange={importarCSV} />
                
                <button className="btn btn-light text-start fw-bold p-2 shadow-sm text-info" onClick={baixarModeloCSV}>
                  <i className="bi bi-file-earmark-spreadsheet me-2"></i> Baixar Modelo (CSV)
                </button>
              </div>
            )}
          </div>

          <hr className="text-muted mt-auto" />
          <button onClick={efetuarLogout} className="btn btn-danger text-start fw-bold p-3 shadow-sm">
            <i className="bi bi-box-arrow-left me-2"></i> Sair do Sistema
          </button>
        </div>
      </div>

      <button 
        onClick={() => setTemaEscuro(!temaEscuro)} 
        className={`btn ${temaEscuro ? 'btn-dark border-secondary' : 'btn-light border'} shadow-sm d-print-none`} 
        style={{ position: 'fixed', right: '74px', top: '20px', zIndex: 1000, borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        title={temaEscuro ? "Mudar para Tema Claro" : "Mudar para Tema Escuro"}
      >
        <i className={`bi ${temaEscuro ? 'bi-sun-fill text-warning' : 'bi-moon-fill'} fs-5`}></i>
      </button>

      <button 
        onClick={efetuarLogout} 
        className="btn btn-light text-danger shadow-sm border d-print-none" 
        style={{ position: 'fixed', right: '16px', top: '20px', zIndex: 1000, borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        title="Sair do Sistema"
      >
        <i className="bi bi-box-arrow-right fs-5"></i>
      </button>

      <div onClick={rolarParaTopo} className={`btn-floating-top ${showTopBtn ? 'visible' : ''} ${telaAtiva === 'avaliacao' || telaAtiva === 'relatorio_agrupado' ? 'empurrado' : ''} d-print-none`}>
        <i className="bi bi-rocket-fill"></i>
      </div>
      <div onClick={rolarParaFundo} className={`btn-floating-bottom ${showBottomBtn ? 'visible' : ''} ${telaAtiva === 'avaliacao' || telaAtiva === 'relatorio_agrupado' ? 'empurrado' : ''} d-print-none`}>
        <i className="bi bi-arrow-down-square-fill"></i>
      </div>
      {telaAtiva === 'avaliacao' && (
        <div className="btn-floating-help d-print-none" data-bs-toggle="modal" data-bs-target="#modalAjuda">
          <i className="bi bi-question-lg"></i>
        </div>
      )}

      {/* --- CORPO PRINCIPAL DO SISTEMA --- */}
      <main className="container pb-1 d-print-none" style={{ paddingTop: '85px' }}>
        
        {/* === TELA 1: LISTA (CARDS) === */}
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
                    <span className="input-group-text bg-transparent border-end-0"><i className="bi bi-search text-body"></i></span>
                    <input type="text" className="form-control bg-transparent text-body border-start-0 ps-0" placeholder="Pesquisar..." value={termoBusca} onChange={(e) => { setTermoBusca(e.target.value); setLimiteExibicao(25); }} />
                  </div>
                  <button className="btn btn-primary px-4 fw-bold" data-bs-toggle="modal" data-bs-target="#modalNovoCadastro">
                    <i className="bi bi-plus-lg me-1"></i> Novo
                  </button>
                </div>
                
                <div className="d-flex flex-column gap-2">
                  <select className="form-select" value={filtroOperador} onChange={(e) => setFiltroOperador(e.target.value)}>
                    <option value="todos">📱 Todos Operadores</option>
                    <option value="CLEYDIR">CLEYDIR</option>
                    <option value="DAVI">DAVI</option>
                    <option value="FELIPE">FELIPE</option>
                    <option value="JOÃO">JOÃO</option>
                    <option value="KAIKE">KAIKE</option>
                    <option value="KAIRON">KAIRON</option>
                  </select>
                  <select className="form-select" value={filtroSelo} onChange={(e) => setFiltroSelo(e.target.value)}>
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
                  <select className="form-select" value={filtroControlador} onChange={(e) => setFiltroControlador(e.target.value)}>
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
                      <div className="mb-2 d-flex justify-content-between align-items-start">
                        <span className="badge-operador">{ent.operador}</span>
                      </div>

                      <div className="mb-2" style={{ height: '50px', display: 'flex', alignItems: 'center', justifyItems: 'center' }}>
                         {ent.logo ? (
                            <img src={ent.logo} alt="Brasão" className="mx-auto" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                         ) : (
                            <i className="bi bi-building text-muted opacity-50 mx-auto" style={{ fontSize: '2rem' }}></i>
                         )}
                      </div>

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

        {/* === TELA 2: TABELAS DE LISTAGEM === */}
        {telaAtiva === 'tabela' && (
          <div className="fade-screen show">
            <button onClick={() => { setTelaAtiva('lista'); window.scrollTo(0,0); }} className="btn btn-light border shadow-sm mb-4 fw-bold">
              <i className="bi bi-arrow-left me-2"></i> Voltar para Cards
            </button>

            <div className="card shadow-sm border-0 mb-4 dark-card-target">
              <div className="card-body p-3">
                <div className="d-flex gap-2 mb-3">
                  <div className="input-group">
                    <span className="input-group-text bg-transparent border-end-0"><i className="bi bi-search text-body"></i></span>
                    <input type="text" className="form-control bg-transparent text-body border-start-0 ps-0" placeholder="Pesquisar por entidade ou controlador..." value={termoBusca} onChange={(e) => setTermoBusca(e.target.value)} />
                  </div>
                  <button className="btn btn-primary px-4 fw-bold" data-bs-toggle="modal" data-bs-target="#modalNovoCadastro">
                    <i className="bi bi-plus-lg me-1"></i> Novo
                  </button>
                </div>
                
                <div className="d-flex flex-column gap-2">
                  <select className="form-select" value={filtroOperador} onChange={(e) => setFiltroOperador(e.target.value)}>
                    <option value="todos">📱 Todos Operadores</option>
                    <option value="CLEYDIR">CLEYDIR</option>
                    <option value="DAVI">DAVI</option>
                    <option value="FELIPE">FELIPE</option>
                    <option value="JOÃO">JOÃO</option>
                    <option value="KAIKE">KAIKE</option>
                    <option value="KAIRON">KAIRON</option>
                  </select>
                  {tipoTabela !== 'controladores' && (
                    <select className="form-select" value={filtroSelo} onChange={(e) => setFiltroSelo(e.target.value)}>
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
                  )}
                </div>
              </div>
            </div>
            
            <div className="card shadow-sm border-0 mb-4 dark-card-target">
              <div className="card-body">
                <h4 className="fw-bold text-primary mb-3">
                  {tipoTabela === 'prefeituras' ? 'Lista de Prefeituras' : 
                   tipoTabela === 'camaras' ? 'Lista de Câmaras' : 
                   'Lista de Controladores'}
                </h4>
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        {tipoTabela === 'controladores' ? (
                          <>
                            <th>Controlador</th>
                            <th>Entidade</th>
                            <th>Operador</th>
                            <th>Telefone</th>
                            <th className="text-center">Ações</th>
                          </>
                        ) : (
                          <>
                            <th>Entidade</th>
                            <th>Controlador</th>
                            <th>Operador</th>
                            <th>Selo</th>
                            <th className="text-center">Ações</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {getDadosTabela().map(ent => (
                        <tr key={ent.id}>
                          {tipoTabela === 'controladores' ? (
                            <>
                              <td className="fw-bold">{ent.controlador}</td>
                              <td>{ent.nome}</td>
                              <td><span className="badge bg-secondary">{ent.operador}</span></td>
                              <td>{ent.telefone || '---'}</td>
                            </>
                          ) : (
                            <>
                              <td className="fw-bold">{ent.nome}</td>
                              <td>{ent.controlador || '---'}</td>
                              <td><span className="badge bg-secondary">{ent.operador}</span></td>
                              <td>
                                <span className={`badge selo-${normalizarTexto(ent.selo)}`}>{ent.selo}</span>
                              </td>
                            </>
                          )}
                          <td className="text-center">
                            <div className="d-flex justify-content-center gap-1">
                                <button onClick={() => { setEntidadeEditando(ent.id); setTelaAtiva('avaliacao'); window.scrollTo(0,0); }} className="btn btn-sm btn-primary py-0 px-2" title="Avaliar"><i className="bi bi-check2-square"></i></button>
                                <button onClick={() => prepararEdicao(ent.id)} data-bs-toggle="modal" data-bs-target="#modalEditarCadastro" className="btn btn-sm btn-outline-secondary py-0 px-2" title="Editar"><i className="bi bi-pencil"></i></button>
                                <button onClick={() => prepararExclusao(ent.id)} data-bs-toggle="modal" data-bs-target="#modalConfirmarExclusao" className="btn btn-sm btn-outline-danger py-0 px-2" title="Excluir"><i className="bi bi-trash"></i></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {getDadosTabela().length === 0 && (
                        <tr>
                          <td colSpan="5" className="text-center py-4 text-muted">Nenhum registro encontrado para esta categoria com os filtros atuais.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* === TELA 3: AVALIAÇÃO DETALHADA (TELA) === */}
        {telaAtiva === 'avaliacao' && entidadeEditando && (
          <div className="fade-screen show">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <button onClick={() => { setTelaAtiva('lista'); setEntidadeEditando(null); window.scrollTo(0,0); }} className="btn btn-light border shadow-sm fw-bold">
                <i className="bi bi-arrow-left me-2"></i> Voltar
              </button>
              
              <button className="btn btn-outline-danger shadow-sm fw-bold" data-bs-toggle="modal" data-bs-target="#modalRelatorio">
                <i className="bi bi-file-earmark-pdf-fill me-2"></i> Gerar PDF
              </button>
            </div>

            <div className="card shadow-sm border-0 mb-4 dark-card-target">
              <div className="card-body text-center">
                
                {bancoDeDados[entidadeEditando].logo && (
                   <img src={bancoDeDados[entidadeEditando].logo} alt="Brasão da Entidade" className="mb-3" style={{ maxHeight: '80px', maxWidth: '100%', objectFit: 'contain' }} />
                )}

                <h4 className="fw-bold text-primary mb-3">{bancoDeDados[entidadeEditando].nome}</h4>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="fw-bold">Progresso Geral:</span>
                  <span className={`badge p-3 fs-6 rounded-pill selo-${normalizarTexto(bancoDeDados[entidadeEditando].selo)}`}>
                    {bancoDeDados[entidadeEditando].selo}
                  </span>
                </div>
                <div className="progress mb-3" style={{ height: '25px', borderRadius: '12px' }}>
                  <div className="progress-bar bg-success progress-bar-striped progress-bar-animated fw-bold fs-6" style={{ width: `${bancoDeDados[entidadeEditando].perc}%` }}>
                    {bancoDeDados[entidadeEditando].perc}%
                  </div>
                </div>
                
                <div className="alert alert-warning py-2 m-0 small d-flex align-items-center justify-content-center text-start border-0 shadow-sm" style={{ borderRadius: '10px' }}>
                    <i className="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
                    <span><strong>Aviso:</strong> Por se tratar de uma simulação (metodologia Atricon), o resultado final pode apresentar variação de até <strong>±1,5%</strong>.</span>
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

            <div className="mt-5 mb-4 text-center">
                <button onClick={finalizarAvaliacao} className="btn btn-success btn-lg fw-bold shadow border-0 px-5 rounded-pill" style={{ padding: '15px 30px', fontSize: '1.1rem' }}>
                    <i className="bi bi-check-circle-fill me-2"></i> Confirmar e Salvar Avaliação
                </button>
            </div>

          </div>
        )}

        {/* === TELA 4: RELATÓRIO AGRUPADO EM PDF (VISUALIZAÇÃO NA TELA) === */}
        {telaAtiva === 'relatorio_agrupado' && (
          <div className="fade-screen show pb-5">
            <div className="mb-4 d-flex justify-content-between align-items-center d-print-none">
              <button onClick={() => { setTelaAtiva('lista'); window.scrollTo(0,0); }} className="btn btn-light border shadow-sm fw-bold">
                <i className="bi bi-arrow-left me-2"></i> Voltar para o Painel
              </button>
              <button onClick={() => window.print()} className="btn btn-danger shadow-sm fw-bold">
                <i className="bi bi-printer-fill me-2"></i> Imprimir Relatório
              </button>
            </div>

            <div className="card shadow-sm border-0 dark-card-target">
              <div className="card-body p-4 p-md-5">
                <div className="text-center mb-4 border-bottom pb-3">
                  <h3 className="fw-bold m-0 text-primary">Relatório de Agrupamento</h3>
                  <h5 className="text-muted">Simulador de Transparência - Atricon 2026</h5>
                  <div className="mt-3 d-flex justify-content-center gap-4 text-muted small">
                      <span><b>Data:</b> {new Date().toLocaleDateString('pt-BR')}</span>
                      <span><b>Filtro Aplicado:</b> {relTipo === 'todos' ? 'Todos os Registros' : `${relTipo.toUpperCase()} - ${relValor.toUpperCase()}`}</span>
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="table table-bordered table-sm align-middle text-center" style={{ fontSize: '0.85rem' }}>
                    <thead className="table-light">
                      <tr>
                        <th className="text-start">Entidade</th>
                        <th>Operador</th>
                        <th>Controlador</th>
                        <th>Telefone</th>
                        <th>Selo Projetado</th>
                        <th>Nota (%)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dadosRelatorioAgrupado.map(ent => (
                        <tr key={ent.id}>
                          <td className="text-start fw-bold text-wrap" style={{ maxWidth: '200px' }}>{ent.nome}</td>
                          <td>{ent.operador}</td>
                          <td className="text-wrap" style={{ maxWidth: '150px' }}>{ent.controlador || '---'}</td>
                          <td>{ent.telefone || '---'}</td>
                          <td>
                              <span className={`badge selo-${normalizarTexto(ent.selo)} w-100`}>{ent.selo}</span>
                          </td>
                          <td className="fw-bold">{ent.perc}%</td>
                        </tr>
                      ))}
                      {dadosRelatorioAgrupado.length === 0 && (
                        <tr>
                          <td colSpan="6" className="text-center py-4 text-muted">Nenhum registro encontrado para o filtro selecionado.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FOOTER Padrão (Não aparece no print) */}
        <footer className="mt-4 text-center text-muted small border-top pt-3 mb-2">
          <span><b>{entidadesAvaliadas}</b> avaliadas de {totalNoBanco} entidades</span> <br/>
          <span>© 2026 TD2 - Simulador de Transparência Atricon</span>
        </footer>
      </main>

      {/* ===================================================================
          A MÁGICA: LAYOUTS EXCLUSIVOS PARA O PDF (QUE SÓ APARECEM NA IMPRESSÃO)
          FORA DA TAG <MAIN> PARA NÃO SEREM ESCONDIDOS
          =================================================================== */}
      
      <div className="d-none d-print-block w-100 bg-white text-dark">
        {/* IMPRESSÃO: PDF DA ENTIDADE INDIVIDUAL */}
        {telaAtiva === 'avaliacao' && entidadeEditando && (
            <div>
                <div className="text-center mb-4" style={{ borderBottom: '2px solid #000', paddingBottom: '10px' }}>
                    
                    {bancoDeDados[entidadeEditando].logo && (
                        <img src={bancoDeDados[entidadeEditando].logo} alt="Logo" style={{ maxHeight: '100px', marginBottom: '15px' }} />
                    )}

                    <h3 className="fw-bold m-0 text-dark">{bancoDeDados[entidadeEditando].nome}</h3>
                    <h5 className="text-secondary">Relatório de Simulação - PNTP Atricon</h5>
                    <div className="mt-3 d-flex justify-content-around text-dark">
                        <span><b>Data:</b> {new Date().toLocaleDateString('pt-BR')}</span>
                        <span><b>Controlador:</b> {bancoDeDados[entidadeEditando].controlador || 'Não informado'}</span>
                    </div>
                </div>

                <div className="mb-4 p-3 bg-light rounded text-center" style={{ border: '1px solid #ccc' }}>
                    <h5 className="m-0 text-dark">
                        Selo Projetado: <b>{bancoDeDados[entidadeEditando].selo}</b> <br/>
                        Aderência aos Critérios: <b>{bancoDeDados[entidadeEditando].perc}%</b>
                    </h5>
                    
                    <p className="mt-2 mb-0 small text-danger fw-bold">
                        * Nota de Simulação: A pontuação pode variar em até ±1,5% em relação à avaliação oficial.
                    </p>
                </div>

                <h5 className="fw-bold mb-3 text-dark">Critérios Avaliados ({filtroRelatorio === 'todos' ? 'Todos' : filtroRelatorio === 'atendendo' ? 'Atendidos' : 'Pendentes'})</h5>

                {GRUPOS_CRITERIOS.map((grupo, idx) => {
                    const ehCamara = normalizarTexto(bancoDeDados[entidadeEditando].nome).includes('camara');
                    const num = parseInt(grupo.titulo);
                    if (ehCamara && [16, 17, 18, 19].includes(num)) return null;
                    if (!ehCamara && num === 20) return null;

                    const itensFiltrados = grupo.itens.filter(item => {
                        const atende = verificaSeAtende(item, bancoDeDados[entidadeEditando].marcados);
                        if (filtroRelatorio === 'atendendo') return atende;
                        if (filtroRelatorio === 'nao_atendendo') return !atende;
                        return true;
                    });

                    if (itensFiltrados.length === 0) return null;

                    return (
                        <div key={idx} className="print-avoid-break mb-4">
                            <div className="p-2 fw-bold text-white bg-dark mb-2" style={{ backgroundColor: '#000 !important', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
                                {grupo.titulo}
                            </div>
                            <table className="table table-sm table-bordered">
                                <thead>
                                    <tr className="bg-light">
                                        <th style={{ width: '8%' }} className="text-dark">ID</th>
                                        <th className="text-dark">Critério</th>
                                        <th style={{ width: '15%' }} className="text-dark">Tipo</th>
                                        <th className="text-center text-dark" style={{ width: '15%' }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {itensFiltrados.map(item => {
                                        const atende = verificaSeAtende(item, bancoDeDados[entidadeEditando].marcados);
                                        return (
                                            <tr key={item.id}>
                                                <td className="text-dark"><b>{item.id}</b></td>
                                                <td className="text-dark">{item.nome}</td>
                                                <td className="text-capitalize text-dark">{item.classificacao}</td>
                                                <td className="text-center fw-bold" style={{ color: atende ? 'green' : 'red' }}>
                                                    {atende ? 'Atende ✓' : 'Não Atende ✗'}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    );
                })}

                <div className="mt-5 pt-5 text-center text-dark" style={{ pageBreakInside: 'avoid' }}>
                    <div className="d-flex justify-content-center mb-2">
                        <div style={{ width: '250px', borderTop: '1px solid #000' }}></div>
                    </div>
                    <p className="fw-bold mb-4">{bancoDeDados[entidadeEditando].operador} (Operador Responsável)</p>
                    
                    <p className="text-secondary small mb-0">
                        Gerado pelo <b>Simulador de Avaliação Atricon 2026 - TD2</b>
                    </p>
                    <p className="text-secondary small">
                        Data de emissão: {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}
                    </p>
                </div>
            </div>
        )}

        {/* IMPRESSÃO: PDF DO RELATÓRIO AGRUPADO */}
        {telaAtiva === 'relatorio_agrupado' && (
            <div>
                <div className="text-center mb-4 border-bottom pb-3">
                    <h3 className="fw-bold m-0 text-dark">Relatório de Agrupamento - PNTP Atricon</h3>
                    <div className="mt-3 d-flex justify-content-around text-dark">
                        <span><b>Data:</b> {new Date().toLocaleDateString('pt-BR')}</span>
                        <span><b>Filtro Aplicado:</b> {relTipo === 'todos' ? 'Todos os Registros' : `${relTipo.toUpperCase()} - ${relValor.toUpperCase()}`}</span>
                    </div>
                </div>

                <table className="table table-bordered table-sm align-middle text-center" style={{ fontSize: '0.85rem' }}>
                    <thead className="table-light">
                        <tr>
                        <th className="text-start text-dark">Entidade</th>
                        <th className="text-dark">Operador</th>
                        <th className="text-dark">Controlador</th>
                        <th className="text-dark">Telefone</th>
                        <th className="text-dark">Selo Projetado</th>
                        <th className="text-dark">Nota (%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dadosRelatorioAgrupado.map(ent => (
                        <tr key={ent.id}>
                            <td className="text-start fw-bold text-dark">{ent.nome}</td>
                            <td className="text-dark">{ent.operador}</td>
                            <td className="text-dark">{ent.controlador || '---'}</td>
                            <td className="text-dark">{ent.telefone || '---'}</td>
                            <td className="text-dark fw-bold">{ent.selo}</td>
                            <td className="fw-bold text-dark">{ent.perc}%</td>
                        </tr>
                        ))}
                        {dadosRelatorioAgrupado.length === 0 && (
                        <tr>
                            <td colSpan="6" className="text-center py-4 text-muted">Nenhum registro encontrado.</td>
                        </tr>
                        )}
                    </tbody>
                </table>

                <div className="mt-5 text-center text-dark" style={{ pageBreakInside: 'avoid' }}>
                    <p className="text-secondary small mb-0">
                        Gerado pelo <b>Simulador de Avaliação Atricon 2026 - TD2</b>
                    </p>
                    <p className="text-secondary small">
                        Data de emissão: {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}
                    </p>
                </div>
            </div>
        )}
      </div>

      {/* ===================================================================
          MODAIS DO SISTEMA (ESCONDIDOS NA IMPRESSÃO)
          =================================================================== */}
      
      {/* 0. MODAL DE RELATÓRIO POR AGRUPAMENTO (PDF E CSV) */}
      <div className="modal fade d-print-none" id="modalRelatoriosGerenciais" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg">
            <div className="modal-header bg-success text-white border-0">
              <h5 className="modal-title fw-bold"><i className="bi bi-funnel-fill me-2"></i> Relatório por agrupamento</h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" id="btnFecharModalRelatoriosGerenciais"></button>
            </div>
            <div className="modal-body p-4">
                <p className="text-muted small mb-4">Escolha os filtros abaixo para gerar um relatório em PDF ou planillha Excel (CSV) contendo apenas os dados desejados.</p>
                
                <div className="mb-3">
                    <label className="form-label fw-bold">Tipo de Relatório</label>
                    <select className="form-select" value={relTipo} onChange={(e) => setRelTipo(e.target.value)}>
                        <option value="todos">Todos os Registros</option>
                        <option value="operador">Por Operador</option>
                        <option value="selo">Por Selo Projetado</option>
                        <option value="controlador">Por Situação do Controlador</option>
                        <option value="poder">Por Poder (Executivo/Legislativo)</option>
                    </select>
                </div>

                {relTipo === 'operador' && (
                    <div className="mb-3">
                        <label className="form-label fw-bold">Selecione o Operador</label>
                        <select className="form-select" value={relValor} onChange={(e) => setRelValor(e.target.value)}>
                            <option value="todos">Todos</option>
                            <option value="CLEYDIR">CLEYDIR</option>
                            <option value="DAVI">DAVI</option>
                            <option value="FELIPE">FELIPE</option>
                            <option value="JOÃO">JOÃO</option>
                            <option value="KAIKE">KAIKE</option>
                            <option value="KAIRON">KAIRON</option>
                        </select>
                    </div>
                )}

                {relTipo === 'selo' && (
                    <div className="mb-3">
                        <label className="form-label fw-bold">Selecione o Selo</label>
                        <select className="form-select" value={relValor} onChange={(e) => setRelValor(e.target.value)}>
                            <option value="todos">Todos</option>
                            <option value="DIAMANTE">DIAMANTE</option>
                            <option value="OURO">OURO</option>
                            <option value="PRATA">PRATA</option>
                            <option value="ELEVADO">ELEVADO</option>
                            <option value="INTERMEDIARIO">INTERMEDIARIO</option>
                            <option value="BASICO">BÁSICO</option>
                            <option value="INICIAL">INICIAL</option>
                            <option value="INEXISTENTE">INEXISTENTE</option>
                        </select>
                    </div>
                )}

                {relTipo === 'controlador' && (
                    <div className="mb-3">
                        <label className="form-label fw-bold">Situação</label>
                        <select className="form-select" value={relValor} onChange={(e) => setRelValor(e.target.value)}>
                            <option value="todos">Todos</option>
                            <option value="com">Com Controlador Cadastrado</option>
                            <option value="sem">Sem Controlador Cadastrado</option>
                        </select>
                    </div>
                )}

                {relTipo === 'poder' && (
                    <div className="mb-3">
                        <label className="form-label fw-bold">Poder / Esfera</label>
                        <select className="form-select" value={relValor} onChange={(e) => setRelValor(e.target.value)}>
                            <option value="todos">Todos</option>
                            <option value="executivo">Executivo (Prefeituras)</option>
                            <option value="legislativo">Legislativo (Câmaras)</option>
                        </select>
                    </div>
                )}
            </div>
            <div className="modal-footer border-0 pt-0 d-flex flex-wrap justify-content-between">
              <button type="button" className="btn btn-light shadow-sm mb-2" data-bs-dismiss="modal">Cancelar</button>
              <div className="d-flex gap-2 mb-2">
                  <button type="button" className="btn btn-danger shadow-sm fw-bold" data-bs-dismiss="modal" onClick={gerarRelatorioGerencialPDF}>
                      <i className="bi bi-file-earmark-pdf me-1"></i> Gerar PDF
                  </button>
                  <button type="button" className="btn btn-success shadow-sm fw-bold" data-bs-dismiss="modal" onClick={gerarRelatorioGerencialCSV}>
                      <i className="bi bi-file-earmark-excel me-1"></i> Baixar CSV
                  </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 0.5 MODAL GERAÇÃO DE RELATÓRIO PDF (POR ENTIDADE) */}
      <div className="modal fade d-print-none" id="modalRelatorio" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg">
            <div className="modal-header bg-danger text-white border-0">
              <h5 className="modal-title fw-bold"><i className="bi bi-file-earmark-pdf-fill me-2"></i> Configurar PDF</h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" id="btnFecharModalRelatorio"></button>
            </div>
            <div className="modal-body p-4">
              <div className="alert alert-info border-0 small mb-4">
                <i className="bi bi-info-circle-fill me-2"></i> O PDF será gerado nativamente pelo seu navegador. A logo oficial da entidade será incluída automaticamente se estiver cadastrada.
              </div>
              
              <div className="mb-4">
                <label className="form-label fw-bold">O que incluir no relatório?</label>
                <select className="form-select" value={filtroRelatorio} onChange={(e) => setFiltroRelatorio(e.target.value)}>
                    <option value="todos">Listar Todos os Critérios</option>
                    <option value="atendendo">Apenas Itens Atendidos (Verdes)</option>
                    <option value="nao_atendendo">Apenas Pendências (Vermelhos)</option>
                </select>
              </div>
            </div>
            <div className="modal-footer border-0 pt-0">
              <button type="button" className="btn btn-light shadow-sm" data-bs-dismiss="modal">Cancelar</button>
              <button type="button" className="btn btn-danger shadow-sm fw-bold" data-bs-dismiss="modal" onClick={imprimirPDF}>Gerar / Imprimir</button>
            </div>
          </div>
        </div>
      </div>

      {/* 1. MODAL DE AJUDA */}
      <div className="modal fade d-print-none" id="modalAjuda" tabIndex="-1" aria-hidden="true">
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
      <div className="modal fade d-print-none" id="modalNovoCadastro" tabIndex="-1" aria-hidden="true">
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
              <div className="mb-3">
                <label className="form-label fw-bold">Logo Oficial (Máx 500KB)</label>
                <input type="file" id="logoInputNovo" className="form-control" accept="image/png, image/jpeg" onChange={handleUploadLogoNova} />
                {novoLogo && (
                    <div className="mt-3 text-center">
                        <img src={novoLogo} alt="Preview" className="bg-white border p-1 rounded mb-2" style={{maxHeight: '60px'}}/>
                        <br/>
                        <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => { setNovoLogo(""); document.getElementById("logoInputNovo").value = ""; }}>
                            <i className="bi bi-trash me-1"></i> Remover Logo
                        </button>
                    </div>
                )}
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
      <div className="modal fade d-print-none" id="modalEditarCadastro" tabIndex="-1" aria-hidden="true">
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
              <div className="mb-3">
                <label className="form-label fw-bold">Logo Oficial (Máx 500KB)</label>
                <input type="file" id="logoInputEdit" className="form-control" accept="image/png, image/jpeg" onChange={handleUploadLogoEdit} />
                {editLogo && (
                    <div className="mt-3 text-center">
                        <img src={editLogo} alt="Preview" className="bg-white border p-1 rounded mb-2" style={{maxHeight: '60px'}}/>
                        <br/>
                        <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => { setEditLogo(""); document.getElementById("logoInputEdit").value = ""; }}>
                            <i className="bi bi-trash me-1"></i> Remover Logo
                        </button>
                    </div>
                )}
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
      <div className="modal fade d-print-none" id="modalConfirmarExclusao" tabIndex="-1" aria-hidden="true">
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