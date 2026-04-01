// Importações do Firebase direto da nuvem do Google
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// A sua chave secreta do cofre
const firebaseConfig = {
    apiKey: "AIzaSyAPMG3dWe_qpyUXU-FHAbLfuaquSzuRqAc",
    authDomain: "simulador-atricon-2026.firebaseapp.com",
    projectId: "simulador-atricon-2026",
    storageBucket: "simulador-atricon-2026.firebasestorage.app",
    messagingSenderId: "27956024483",
    appId: "1:27956024483:web:54a3deb5946501ff04db16"
};

// Conectando o sistema
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

const GRUPOS_CRITERIOS = [
    {
        titulo: "1. Informações Prioritárias",
        pesoDimensao: 2,
        itens: [
            { id: "1.1", nome: "Possui sítio oficial próprio na internet?", classificacao: "essencial", exige: ['g'] },
            { id: "1.2", nome: "Possui portal da transparência próprio ou compartilhado na internet?", classificacao: "essencial", exige: ['g'] },
            { id: "1.3", nome: "O acesso ao portal transparência está visível na capa do site?", classificacao: "obrigatoria", exige: ['g'] },
            { id: "1.4", nome: "O site e o portal de transparência contêm ferramenta de pesquisa de conteúdo que permita o acesso à informação?", classificacao: "obrigatoria", exige: ['g'] }
        ]
    },
    {
        titulo: "2. Informações Institucionais",
        pesoDimensao: 2,
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
        titulo: "3. Receitas",
        pesoDimensao: 4,
        itens: [
            { id: "3.1", nome: "Divulga as receitas do Poder ou órgão, evidenciando sua previsão e realização?", classificacao: "essencial", exige: ['g', 's', 'a'] },
            { id: "3.2", nome: "Divulga a classification orçamentária por natureza da receita?", classificacao: "essencial", exige: ['g', 's', 'a'] },
            { id: "3.3", nome: "Divulga a lista dos inscritos em dívida ativa?", classificacao: "obrigatoria", exige: ['g', 's', 'a'] }
        ]
    },
    {
        titulo: "4. Despesas",
        pesoDimensao: 4,
        itens: [
            { id: "4.1", nome: "Divulga o total das despesas empenhadas, liquidadas e pagas?", classificacao: "essencial", exige: ['g', 's', 'a'] },
            { id: "4.2", nome: "Divulga as despesas por classificação orçamentária?", classificacao: "essencial", exige: ['g', 's', 'a'] },
            { id: "4.3", nome: "Possibilita a consulta de empenhos com detalhes do beneficiário, valor, objeto e licitação originária?", classificacao: "essencial", exige: ['g', 's', 'a'] },
            { id: "4.4", nome: "Publica relação das despesas com aquisições de bens efetuadas pela instituição contendo: identificação do bem, preço unitário, quantidade, nome do fornecedor e valor total de cada aquisição?", classificacao: "recomendada", exige: ['g', 's', 'a'] },
            { id: "4.5", nome: "Publica informações sobre despesas de patrocínio?", classificacao: "recomendada", exige: ['g', 's', 'a'] },
            { id: "4.6", nome: "Publica informações detalhadas sobre a execution dos contratos de publicidade, com nomes dos fornecedores de serviços especializados e veículos, bem como informações sobre os totais de valores pagos para cada tipo de serviço e meio de divulgação?", classificacao: "recomendada", exige: ['g', 's', 'a'] }
        ]
    },
    {
        titulo: "5. Convênios e Transferências",
        pesoDimensao: 1,
        itens: [
            { id: "5.1", nome: "Divulga as transferências recebidas (convênios/acordos)?", classificacao: "obrigatoria", exige: ['g', 's', 'a'] },
            { id: "5.2", nome: "Divulga as transferências realizadas (convênios/acordos)?", classificacao: "obrigatoria", exige: ['g', 's', 'a'] },
            { id: "5.3", nome: "Divulga os acordos firmados que não envolvam transferência de recursos financeiros?", classificacao: "obrigatoria", exige: ['g', 's', 'a'] }
        ]
    },
    {
        titulo: "6. Recursos Humanos",
        pesoDimensao: 3,
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
        titulo: "7. Diárias",
        pesoDimensao: 1,
        itens: [
            { id: "7.1", nome: "Divulga nome, cargo, valor, período, motivo e destino do afastamento?", classificacao: "obrigatoria", exige: ['g', 's', 'a'] },
            { id: "7.2", nome: "Divulga tabela com os valores das diárias?", classificacao: "obrigatoria", exige: ['g', 's', 'a'] }
        ]
    },
    {
        titulo: "8. Licitações",
        pesoDimensao: 3,
        itens: [
            { id: "8.1", nome: "Divulga a relação das licitações (número, modalidade, objeto, data, valor e situação)?", classificacao: "obrigatoria", exige: ['g', 's', 'a'] },
            { id: "8.2", nome: "Divulga a íntegra dos editais de licitação?", classificacao: "obrigatoria", exige: ['g', 's', 'a'] },
            { id: "8.3", nome: "Divulga a íntegra dos demais documentos das fases interna e externa?", classificacao: "obrigatoria", exige: ['g', 's', 'a'] },
            { id: "8.4", nome: "Divulga a íntegra dos principais documentos dos processos de dispensa e inexigibilidade?", classificacao: "obrigatoria", exige: ['g', 's', 'a'] },
            { id: "8.5", nome: "Divulga a íntegra das Atas de Adesão – SRP?", classificacao: "obrigatoria", exige: ['g', 's', 'a'] },
            { id: "8.6", nome: "Divulga o plano de contratações anual?", classificacao: "recomendada", exige: ['g', 's'] },
            { id: "8.7", nome: "Divulga a relação dos licitantes e/ou contratados sancionados?", classificacao: "recomendada", exige: ['g', 's', 'a'] },
            { id: "8.8", nome: "Divulga regulamento interno de licitações e contratos?", classificacao: "obrigatoria", exige: ['g'] }
        ]
    },
    {
        titulo: "9. Contratos",
        pesoDimensao: 3,
        itens: [
            { id: "9.1", nome: "Divulga a relação dos contratos celebrados com resumo e aditivos?", classificacao: "obrigatoria", exige: ['g', 's', 'a'] },
            { id: "9.2", nome: "Divulga o inteiro teor dos contratos e aditivos?", classificacao: "obrigatoria", exige: ['g', 's', 'a'] },
            { id: "9.3", nome: "Divulga a relação/lista dos fiscais de cada contrato?", classificacao: "obrigatoria", exige: ['g', 's', 'a'] },
            { id: "9.4", nome: "Divulga a ordem cronológica de seus pagamentos?", classificacao: "obrigatoria", exige: ['g', 's', 'a'] }
        ]
    },
    {
        titulo: "10. Obras",
        pesoDimensao: 2,
        itens: [
            { id: "10.1", nome: "Divulga informações sobre as obras (objeto, situation, datas, empresa e percentual)?", classificacao: "recomendada", exige: ['g', 's'] },
            { id: "10.2", nome: "Divulga os quantitativos, preços unitários e totais contratados?", classificacao: "obrigatoria", exige: ['g', 's'] },
            { id: "10.3", nome: "Divulga os quantitativos executados e preços efetivamente pagos?", classificacao: "obrigatoria", exige: ['g', 's'] },
            { id: "10.4", nome: "Divulga a relação das obras paralisadas?", classificacao: "obrigatoria", exige: ['g', 's'] }
        ]
    },
    {
        titulo: "11. Planejamento e Prestação de contas",
        pesoDimensao: 4,
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
        titulo: "12. Serviço de Informação ao Cidadão - SIC",
        pesoDimensao: 2,
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
        titulo: "13. Acessibilidade",
        pesoDimensao: 1,
        itens: [
            { id: "13.1", nome: "O site e o portal contêm símbolo de acessibilidade em destaque?", classificacao: "obrigatoria", exige: ['g'] },
            { id: "13.2", nome: "Contêm exibição do caminho de páginas (breadcrumb)?", classificacao: "obrigatoria", exige: ['g'] },
            { id: "13.3", nome: "Contêm opção de alto contraste?", classificacao: "obrigatoria", exige: ['g'] },
            { id: "13.4", nome: "Contêm ferramenta de redimensionamento de texto?", classificacao: "obrigatoria", exige: ['g'] },
            { id: "13.5", nome: "Contêm mapa do site institucional?", classificacao: "recomendada", exige: ['g'] }
        ]
    },
    {
        titulo: "14. Ouvidorias",
        pesoDimensao: 1,
        itens: [
            { id: "14.1", nome: "Há informações sobre o atendimento presencial pela Ouvidoria?", classificacao: "obrigatoria", exige: ['g'] },
            { id: "14.2", nome: "Há canal eletrônico de acesso/interação com a ouvidoria?", classificacao: "obrigatoria", exige: ['g'] },
            { id: "14.3", nome: "Divulga Carta de Serviços ao Usuário?", classificacao: "obrigatoria", exige: ['g'] }
        ]
    },
    {
        titulo: "15. Lei Geral de Proteção de Dados (LGPD) e Governo Digital",
        pesoDimensao: 1,
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
        titulo: "16. Renúncias de Receitas",
        pesoDimensao: 1,
        itens: [
            { id: "16.1", nome: "Divulga as desonerações tributárias concedidas?", classificacao: "obrigatoria", exige: ['g'] },
            { id: "16.2", nome: "Divulga os valores da renúncia fiscal prevista e realizada?", classificacao: "obrigatoria", exige: ['g', 's', 'a'] },
            { id: "16.3", nome: "Identifica os beneficiários das desonerações tributárias?", classificacao: "recomendada", exige: ['g', 's', 'a'] },
            { id: "16.4", nome: "Divulga informações sobre projetos de incentivo à cultura e esportes?", classificacao: "recomendada", exige: ['g', 's', 'a'] }
        ]
    },
    {
        titulo: "17. Emendas Parlamentares",
        pesoDimensao: 1,
        itens: [
            { id: "17.1", nome: "Identifica as emendas parlamentares federais recebidas?", classificacao: "obrigatoria", exige: ['g', 's', 'a'] },
            { id: "17.2", nome: "Identifica as emendas parlamentares estaduais e municipais?", classificacao: "obrigatoria", exige: ['g', 's', 'a'] },
            { id: "17.3", nome: "Demonstra a execução orçamentária e financeira oriunda das emendas parlamentares recebidas e próprias?", classificacao: "obrigatoria", exige: ['g', 's', 'a'] }
        ]
    },
    {
        titulo: "18. Saúde",
        pesoDimensao: 1,
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
        titulo: "19. Educação e Assistência Social",
        pesoDimensao: 1,
        itens: [
            { id: "19.1", nome: "Divulga o plano de educação e o respectivo relatório de resultados?", classificacao: "recomendada", exige: ['g', 's', 'a'] },
            { id: "19.2", nome: "Divulga a lista de espera em creches públicas?", classificacao: "obrigatoria", exige: ['g', 's'] },
            { id: "19.3", nome: "Divulga informações atualizadas sobre a composição e o funcionamento do Conselho do Fundeb?", classificacao: "obrigatoria", exige: ['g'] },
            { id: "19.4", nome: "Divulga informações atualizadas sobre a composição e o funcionamento do Conselho de Assistência Social?", classificacao: "recomendada", exige: ['g'] }
        ]
    },
    {
        titulo: "20. Atividades Finalísticas - Poder Legislativo",
        pesoDimensao: 3,
        itens: [
            { id: "20.1", nome: "Divulga a composição da Casa, com a biografia dos parlamentares?", classificacao: "obrigatoria", exige: ['g'] },
            { id: "20.2", nome: "Divulga as leis e atos infralegais produzidos?", classificacao: "obrigatoria", exige: ['g', 's', 'a'] },
            { id: "20.3", nome: "Divulga projetos de leis e as respectivas tramitações?", classificacao: "obrigatoria", exige: ['g', 's', 'a'] },
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

const DATA_ENTIDADES = [{"n": "PREFEITURA MUNICIPAL DE MAURITI", "o": "CLEYDIR"}, {"n": "PREFEITURA MUNICIPAL DE AMONTADA", "o": "CLEYDIR"}, {"n": "PREFEITURA MUNICIPAL DE CAMPOS SALES", "o": "CLEYDIR"}, {"n": "PREFEITURA MUNICIPAL DE SÃO BENEDITO", "o": "CLEYDIR"}, {"n": "PREFEITURA MUNICIPAL DE REDENÇÃO", "o": "CLEYDIR"}, {"n": "PREFEITURA MUNICIPAL DE PENTECOSTE", "o": "CLEYDIR"}, {"n": "PREFEITURA MUNICIPAL DE CRATEÚS", "o": "CLEYDIR"}, {"n": "PREFEITURA MUNICIPAL DE CASCAVEL", "o": "CLEYDIR"}, {"n": "PREFEITURA MUNICIPAL DE PEDRA BRANCA", "o": "CLEYDIR"}, {"n": "PREFEITURA MUNICIPAL DE MILHÃ", "o": "CLEYDIR"}, {"n": "PREFEITURA MUNICIPAL DE MADALENA", "o": "CLEYDIR"}, {"n": "PREFEITURA MUNICIPAL DE VIÇOSA DO CEARÁ", "o": "CLEYDIR"}, {"n": "PREFEITURA MUNICIPAL DE MONSENHOR TABOSA", "o": "CLEYDIR"}, {"n": "PREFEITURA MUNICIPAL DE SABOEIRO", "o": "CLEYDIR"}, {"n": "PREFEITURA MUNICIPAL DE MARTINÓPOLE", "o": "CLEYDIR"}, {"n": "PREFEITURA MUNICIPAL DE JIJOCA DE JERICOACOARA", "o": "CLEYDIR"}, {"n": "PREFEITURA MUNICIPAL DE HIDROLÂNDIA", "o": "CLEYDIR"}, {"n": "PREFEITURA MUNICIPAL DE GRANJEIRO", "o": "CLEYDIR"}, {"n": "PREFEITURA MUNICIPAL DE CARIDADE", "o": "CLEYDIR"}, {"n": "PREFEITURA MUNICIPAL DE CHORÓ", "o": "CLEYDIR"}, {"n": "PREFEITURA MUNICIPAL DE CAPISTRANO", "o": "CLEYDIR"}, {"n": "PREFEITURA MUNICIPAL DE BEBERIBE", "o": "CLEYDIR"}, {"n": "PREFEITURA MUNICIPAL DE APUIARÉS", "o": "CLEYDIR"}, {"n": "PREFEITURA MUNICIPAL DE IPAUMIRIM", "o": "DAVI"}, {"n": "PREFEITURA MUNICIPAL DE GUAIÚBA", "o": "DAVI"}, {"n": "PREFEITURA MUNICIPAL DE GENERAL SAMPAIO", "o": "DAVI"}, {"n": "PREFEITURA MUNICIPAL DE IPUEIRAS", "o": "DAVI"}, {"n": "PREFEITURA MUNICIPAL DE PALMÁCIA", "o": "DAVI"}, {"n": "PREFEITURA MUNICIPAL DE ITATIRA", "o": "DAVI"}, {"n": "PREFEITURA MUNICIPAL DE IPAPORANGA", "o": "DAVI"}, {"n": "PREFEITURA MUNICIPAL DE IBIAPINA", "o": "DAVI"}, {"n": "PREFEITURA MUNICIPAL DE ACARAPE", "o": "DAVI"}, {"n": "PREFEITURA MUNICIPAL DE IPU", "o": "DAVI"}, {"n": "PREFEITURA MUNICIPAL DE SÃO GONÇALO DO AMARANTE", "o": "DAVI"}, {"n": "PREFEITURA MUNICIPAL DE PARACURU", "o": "DAVI"}, {"n": "PREFEITURA MUNICIPAL DE IBICUITINGA", "o": "DAVI"}, {"n": "PREFEITURA MUNICIPAL DE AQUIRAZ", "o": "DAVI"}, {"n": "PREFEITURA MUNICIPAL DE QUIXELÔ", "o": "DAVI"}, {"n": "PREFEITURA MUNICIPAL DE ICÓ", "o": "DAVI"}, {"n": "PREFEITURA MUNICIPAL DE CAUCAIA", "o": "DAVI"}, {"n": "PREFEITURA MUNICIPAL DE SÃO JOÃO DO JAGUARIBE", "o": "DAVI"}, {"n": "PREFEITURA MUNICIPAL DE QUITERIANÓPOLIS", "o": "DAVI"}, {"n": "PREFEITURA MUNICIPAL DE PARAIPABA", "o": "DAVI"}, {"n": "PREFEITURA MUNICIPAL DE MERUOCA", "o": "DAVI"}, {"n": "PREFEITURA MUNICIPAL DE URUOCA", "o": "DAVI"}, {"n": "PREFEITURA MUNICIPAL DE PACAJUS", "o": "DAVI"}, {"n": "PREFEITURA MUNICIPAL DE SALITRE", "o": "DAVI"}, {"n": "PREFEITURA MUNICIPAL DE SANTANA DO ACARAÚ", "o": "DAVI"}, {"n": "PREFEITURA MUNICIPAL DE CEDRO", "o": "DAVI"}, {"n": "PREFEITURA MUNICIPAL DE ERERE", "o": "FELIPE"}, {"n": "PREFEITURA MUNICIPAL DE GUARAMIRANGA", "o": "FELIPE"}, {"n": "PREFEITURA MUNICIPAL DE BATURITÉ", "o": "FELIPE"}, {"n": "PREFEITURA MUNICIPAL DE COREAÚ", "o": "FELIPE"}, {"n": "PREFEITURA MUNICIPAL DE IRACEMA", "o": "FELIPE"}, {"n": "PREFEITURA MUNICIPAL DE ORÓS", "o": "FELIPE"}, {"n": "PREFEITURA MUNICIPAL DE IRAUÇUBA", "o": "FELIPE"}, {"n": "PREFEITURA MUNICIPAL DE ACARAÚ", "o": "FELIPE"}, {"n": "PREFEITURA MUNICIPAL DE SENADOR POMPEU", "o": "FELIPE"}, {"n": "PREFEITURA MUNICIPAL DE ITAIÇABA", "o": "FELIPE"}, {"n": "PREFEITURA MUNICIPAL DE EUSÉBIO", "o": "FELIPE"}, {"n": "PREFEITURA MUNICIPAL DE UMARI", "o": "FELIPE"}, {"n": "PREFEITURA MUNICIPAL DE UBAJARA", "o": "FELIPE"}, {"n": "PREFEITURA MUNICIPAL DE ACOPIARA", "o": "FELIPE"}, {"n": "PREFEITURA MUNICIPAL DE VARZEA ALEGRE", "o": "FELIPE"}, {"n": "PREFEITURA MUNICIPAL DE TAUÁ", "o": "FELIPE"}, {"n": "PREFEITURA MUNICIPAL DE RUSSAS", "o": "FELIPE"}, {"n": "PREFEITURA MUNICIPAL DE TRAIRI", "o": "FELIPE"}, {"n": "PREFEITURA MUNICIPAL DE TAMBORIL", "o": "FELIPE"}, {"n": "PREFEITURA MUNICIPAL DE MOMBAÇA", "o": "FELIPE"}, {"n": "PREFEITURA MUNICIPAL DE JARDIM", "o": "FELIPE"}, {"n": "PREFEITURA MUNICIPAL DE DEP. IRAPUAN PINHEIRO", "o": "FELIPE"}, {"n": "PREFEITURA MUNICIPAL DE URUBURETAMA", "o": "FELIPE"}, {"n": "PREFEITURA MUNICIPAL DE LAVRAS DA MANGABEIRA", "o": "FELIPE"}, {"n": "PREFEITURA MUNICIPAL DE FRECHEIRINHA", "o": "FELIPE"}, {"n": "PREFEITURA MUNICIPAL DE BAIXIO", "o": "FELIPE"}, {"n": "PREFEITURA MUNICIPAL DE CRATO", "o": "JOÃO"}, {"n": "PREFEITURA MUNICIPAL DE QUIXERAMOBIM", "o": "JOÃO"}, {"n": "SECRETARIA DE EDUCACAO DE JAGUARETAMA", "o": "JOÃO"}, {"n": "PREFEITURA MUNICIPAL DE ITAPIUNA", "o": "JOÃO"}, {"n": "PREFEITURA MUNICIPAL DE MORRINHOS", "o": "JOÃO"}, {"n": "PREFEITURA MUNICIPAL DE ARACATI", "o": "JOÃO"}, {"n": "PREFEITURA MUNICIPAL DE VARJOTA", "o": "JOÃO"}, {"n": "PREFEITURA MUNICIPAL DE OCARA", "o": "JOÃO"}, {"n": "PREFEITURA MUNICIPAL DE MASSAPÊ", "o": "JOÃO"}, {"n": "PREFEITURA MUNICIPAL DE LIMOEIRO DO NORTE", "o": "JOÃO"}, {"n": "PREFEITURA MUNICIPAL DE ALTANEIRA", "o": "JOÃO"}, {"n": "PREFEITURA MUNICIPAL DE GRAÇA", "o": "JOÃO"}, {"n": "PREFEITURA MUNICIPAL DE PARAMOTI", "o": "JOÃO"}, {"n": "PREFEITURA MUNICIPAL DE MORADA NOVA", "o": "JOÃO"}, {"n": "PREFEITURA MUNICIPAL DE HORIZONTE", "o": "JOÃO"}, {"n": "PREFEITURA MUNICIPAL DE GRANJA", "o": "JOÃO"}, {"n": "PREFEITURA MUNICIPAL DE FORQUILHA", "o": "JOÃO"}, {"n": "PREFEITURA MUNICIPAL DE PINDORETAMA", "o": "JOÃO"}, {"n": "PREFEITURA MUNICIPAL DE NOVA RUSSAS", "o": "JOÃO"}, {"n": "PREFEITURA MUNICIPAL DE ITAPAJÉ", "o": "JOÃO"}, {"n": "PREFEITURA MUNICIPAL DE TURURU", "o": "JOÃO"}, {"n": "PREFEITURA MUNICIPAL DE SANTA QUITÉRIA", "o": "JOÃO"}, {"n": "PREFEITURA MUNICIPAL DE MARANGUAPE", "o": "JOÃO"}, {"n": "PREFEITURA MUNICIPAL DE CANINDÉ", "o": "JOÃO"}, {"n": "PREFEITURA MUNICIPAL DE AURORA", "o": "JOÃO"}, {"n": "PREFEITURA MUNICIPAL DE ICAPUÍ", "o": "KAIKE"}, {"n": "PREFEITURA MUNICIPAL DE PEREIRO", "o": "KAIKE"}, {"n": "PREFEITURA MUNICIPAL DE QUIXERÉ", "o": "KAIKE"}, {"n": "PREFEITURA MUNICIPAL DE POTENGI", "o": "KAIKE"}, {"n": "PREFEITURA MUNICIPAL DE CATARINA", "o": "KAIKE"}, {"n": "PREFEITURA MUNICIPAL DE ARATUBA", "o": "KAIKE"}, {"n": "PREFEITURA MUNICIPAL DE QUIXADA", "o": "KAIKE"}, {"n": "PREFEITURA MUNICIPAL DE JAGUARETAMA", "o": "KAIKE"}, {"n": "PREFEITURA MUNICIPAL DE PORANGA", "o": "KAIKE"}, {"n": "PREFEITURA MUNICIPAL DE CARNAUBAL", "o": "KAIKE"}, {"n": "PREFEITURA MUNICIPAL DE ARACOIABA", "o": "KAIKE"}, {"n": "PREFEITURA MUNICIPAL DE ITAPIPOCA", "o": "KAIKE"}, {"n": "PREFEITURA MUNICIPAL DE AIUABA", "o": "KAIKE"}, {"n": "PREFEITURA MUNICIPAL DE TIANGUÁ", "o": "KAIKE"}, {"n": "PREFEITURA MUNICIPAL DE JUAZEIRO DO NORTE", "o": "KAIKE"}, {"n": "PREFEITURA MUNICIPAL DE ITAREMA", "o": "KAIKE"}, {"n": "PREFEITURA MUNICIPAL DE ITAITINGA", "o": "KAIKE"}, {"n": "PREFEITURA MUNICIPAL DE FORTIM", "o": "KAIKE"}, {"n": "PREFEITURA MUNICIPAL DE PACOTI", "o": "KAIKE"}, {"n": "PREFEITURA MUNICIPAL DE MARCO", "o": "KAIKE"}, {"n": "PREFEITURA MUNICIPAL DE BARBALHA", "o": "KAIKE"}, {"n": "PREFEITURA MUNICIPAL DE ASSARÉ", "o": "KAIKE"}, {"n": "PREFEITURA MUNICIPAL DE JAGUARUANA", "o": "KAIKE"}, {"n": "PREFEITURA MUNICIPAL DE CATUNDA", "o": "KAIKE"}, {"n": "PREFEITURA MUNICIPAL DE BELA CRUZ", "o": "KAIRON"}, {"n": "PREFEITURA MUNICIPAL DE BOA VIAGEM", "o": "KAIRON"}, {"n": "PREFEITURA MUNICIPAL DE ALTO SANTO", "o": "KAIRON"}, {"n": "PREFEITURA MUNICIPAL DE PIQUET CARNEIRO", "o": "KAIRON"}, {"n": "PREFEITURA MUNICIPAL DE PALHANO", "o": "KAIRON"}, {"n": "PREFEITURA MUNICIPAL DE INDEPENDENCIA", "o": "KAIRON"}, {"n": "PREFEITURA MUNICIPAL DE TEJUÇUOCA", "o": "KAIRON"}, {"n": "PREFEITURA MUNICIPAL DE SANTANA DO CARIRI", "o": "KAIRON"}, {"n": "PREFEITURA MUNICIPAL DE POTIRETAMA", "o": "KAIRON"}, {"n": "PREFEITURA MUNICIPAL DE NOVO ORIENTE", "o": "KAIRON"}, {"n": "PREFEITURA MUNICIPAL DE MIRAÍMA", "o": "KAIRON"}, {"n": "PREFEITURA MUNICIPAL DE MILAGRES", "o": "KAIRON"}, {"n": "PREFEITURA MUNICIPAL DE GUARACIABA DO NORTE", "o": "KAIRON"}, {"n": "PREFEITURA MUNICIPAL DE CARIRÉ", "o": "KAIRON"}, {"n": "PREFEITURA MUNICIPAL DE PACATUBA", "o": "KAIRON"}, {"n": "PREFEITURA MUNICIPAL DE BARRO", "o": "KAIRON"},
    {n:"CÂMARA MUNICIPAL DE ACARAPE", o:"CLEYDIR"}, {n:"CAMARA MUNICIPAL DE ARARENDA", o:"CLEYDIR"}, {n:"CÂMARA MUNICIPAL DE ASSARÉ", o:"CLEYDIR"}, {n:"CÂMARA MUNICIPAL DE CARIRÉ", o:"CLEYDIR"}, {n:"CÂMARA MUNICIPAL DE ERERÉ", o:"CLEYDIR"}, {n:"CÂMARA MUNICIPAL DE GRANJA", o:"CLEYDIR"}, {n:"CÂMARA MUNICIPAL DE ICÓ", o:"CLEYDIR"}, {n:"CÂMARA MUNICIPAL DE JARDIM", o:"CLEYDIR"}, {n:"CÂMARA MUNICIPAL DE MONSENHOR TABOSA", o:"CLEYDIR"}, {n:"CÂMARA MUNICIPAL DE MORADA NOVA", o:"CLEYDIR"}, {n:"CÂMARA MUNICIPAL DE ORÓS", o:"CLEYDIR"}, {n:"CÂMARA MUNICIPAL DE AIUABA", o:"DAVI"}, {n:"CÂMARA MUNICIPAL DE ARARIPE", o:"DAVI"}, {n:"CÂMARA MUNICIPAL DE PACAJUS", o:"DAVI"}, {n:"CÂMARA MUNICIPAL DE PACATUBA", o:"DAVI"}, {n:"CÂMARA MUNICIPAL DE PEDRA BRANCA", o:"DAVI"}, {n:"CÂMARA MUNICIPAL DE PEREIRO", o:"DAVI"}, {n:"CÂMARA MUNICIPAL DE POTENGI", o:"DAVI"}, {n:"CÂMARA MUNICIPAL DE POTIRETAMA", o:"DAVI"}, {n:"CÂMARA MUNICIPAL DE SABOEIRO", o:"DAVI"}, {n:"CÂMARA MUNICIPAL DE VARZEA ALEGRE", o:"DAVI"}, {n:"CÂMARA MUNICIPAL DE BATURITÉ", o:"CLEYDIR"}, {n:"CÂMARA MUNICIPAL DE CEDRO", o:"FELIPE"}, {n:"CÂMARA MUNICIPAL DE GENERAL SAMPAIO", o:"DAVI"}, {n:"CÂMARA MUNICIPAL DE IPU", o:"KAIRON"}, {n:"CÂMARA MUNICIPAL DE ITAPIPOCA", o:"FELIPE"}, {n:"CÂMARA MUNICIPAL DE JIJOCA DE JERICOACOARA", o:"JOÃO"}, {n:"CÂMARA MUNICIPAL DE LIMOEIRO DO NORTE", o:"DAVI"}, {n:"CÂMARA MUNICIPAL DE MILAGRES", o:"KAIKE"}, {n:"CÂMARA MUNICIPAL DE PENTECOSTE", o:"KAIRON"}, {n:"CÂMARA MUNICIPAL DE QUIXELÔ", o:"JOÃO"}, {n:"CÂMARA MUNICIPAL DE SALITRE", o:"DAVI"}, {n:"CÂMARA MUNICIPAL DE ALTANEIRA", o:"FELIPE"}, {n:"CAMARA MUNICIPAL DE AQUIRAZ", o:"FELIPE"}, {n:"CÂMARA MUNICIPAL DE CAMOCIM", o:"FELIPE"}, {n:"CÂMARA MUNICIPAL DE HIDROLÂNDIA", o:"FELIPE"}, {n:"CÂMARA MUNICIPAL DE LAVRAS DA MANGABEIRA", o:"FELIPE"}, {n:"CÂMARA MUNICIPAL DE MADALENA", o:"FELIPE"}, {n:"CÂMARA MUNICIPAL DE MAURITI", o:"FELIPE"}, {n:"CÂMARA MUNICIPAL DE NOVO ORIENTE", o:"FELIPE"}, {n:"CÂMARA MUNICIPAL DE SÃO BENEDITO", o:"FELIPE"}, {n:"CÂMARA MUNICIPAL DE SOBRAL", o:"FELIPE"}, {n:"CÂMARA MUNICIPAL DE UMARI", o:"FELIPE"}, {n:"CÂMARA MUNICIPAL DE AMONTADA", o:"JOÃO"}, {n:"CÂMARA MUNICIPAL DE APUIARÉS", o:"JOÃO"}, {n:"CÂMARA MUNICIPAL DE AURORA", o:"JOÃO"}, {n:"CÂMARA MUNICIPAL DE BAIXIO", o:"JOÃO"}, {n:"CÂMARA MUNICIPAL DE BARBALHA", o:"JOÃO"}, {n:"CÂMARA MUNICIPAL DE BARREIRA", o:"JOÃO"}, {n:"CÂMARA MUNICIPAL DE FORTIM - CE", o:"JOÃO"}, {n:"CÂMARA MUNICIPAL DE IPAUMIRIM", o:"JOÃO"}, {n:"CÂMARA MUNICIPAL DE MARACANAÚ", o:"JOÃO"}, {n:"CÂMARA MUNICIPAL DE MIRAÍMA", o:"JOÃO"}, {n:"CÂMARA MUNICIPAL DE MISSÃO VELHA", o:"JOÃO"}, {n:"CÂMARA MUNICIPAL DE TRAIRI", o:"JOÃO"}, {n:"CÂMARA MUNICIPAL DE CAMPOS SALES", o:"KAIKE"}, {n:"CÂMARA MUNICIPAL DE ICAPUÍ", o:"KAIKE"}, {n:"CÂMARA MUNICIPAL DE INDEPENDÊNCIA", o:"KAIKE"}, {n:"CÂMARA MUNICIPAL DE IPAPORANGA", o:"KAIKE"}, {n:"CÂMARA MUNICIPAL DE ITAITINGA", o:"KAIKE"}, {n:"CÂMARA MUNICIPAL de MARCO", o:"KAIKE"}, {n:"CÂMARA MUNICIPAL DE TAUÁ", o:"KAIKE"}, {n:"CÂMARA MUNICIPAL DE TURURU", o:"KAIKE"}, {n:"CÂMARA MUNICIPAL DE URUOCA", o:"KAIKE"}, {n:"CÂMARA MUNICIPAL DE VIÇOSA DO CEARA", o:"KAIKE"}, {n:"CÂMARA MUNICIPAL DE ARACOIABA", o:"KAIRON"}, {n:"CÂMARA MUNICIPAL DE CAPISTRANO", o:"KAIRON"}, {n:"CÂMARA MUNICIPAL DE CARIDADE", o:"KAIRON"}, {n:"CÂMARA MUNICIPAL DE CHORÓ", o:"KAIRON"}, {n:"CÂMARA MUNICIPAL DE CRUZ", o:"KAIRON"}, {n:"CÂMARA MUNICIPAL DE GRANJEIRO", o:"KAIRON"}, {n:"CÂMARA MUNICIPAL DE GUARAMIRANGA", o:"KAIRON"}, {n:"CÂMARA MUNICIPAL DE MORRINHOS", o:"KAIRON"}, {n:"CÂMARA MUNICIPAL DE PALHANO", o:"KAIRON"}, {n:"CÂMARA MUNICIPAL DE PORANGA", o:"KAIRON"}
];

const DB_KEY = 'assesi_atricon_v3_clean'; 
let db = {}; 
let entidadeAtiva = null;
let filtroAtivo = 'todos';
let idParaExcluir = null;
let idParaEditar = null;

let limiteExibicao = 25; 

function normalizarTexto(texto) {
    return texto.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
}

// === SALVAMENTO NA NUVEM ===
async function salvar() { 
    localStorage.setItem(DB_KEY, JSON.stringify(db)); 
    try {
        await setDoc(doc(firestore, "sistema", "bancoGeral"), db);
    } catch (e) {
        console.error("Erro ao salvar no Firebase: ", e);
    }
}

window.onload = async () => {
    // Esconde a ajuda na tela inicial
    const btnHelp = document.querySelector('.btn-floating-help');
    if (btnHelp) btnHelp.style.display = 'none'; 

    const grid = document.getElementById('gridClientes');
    if(grid) grid.innerHTML = '<div class="col-12 text-center mt-5"><div class="spinner-border text-primary" role="status"></div><p class="mt-2 fw-bold text-muted">Sincronizando com a Nuvem...</p></div>';

    try {
        const docRef = doc(firestore, "sistema", "bancoGeral");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            db = docSnap.data(); 
        } else {
            DATA_ENTIDADES.forEach(item => {
                const id = "ENT_" + item.n.replace(/\s/g, "_");
                db[id] = { nome: item.n, operador: item.o, controlador: "", telefone: "", perc: 0, selo: "INEXISTENTE", marcados: {} };
            });
            await salvar(); 
        }
    } catch (erro) {
        console.error("Não foi possível conectar ao Firebase. Usando backup local.", erro);
        db = JSON.parse(localStorage.getItem(DB_KEY)) || {};
    }
    
    const btnTodos = document.getElementById('btn-todos');
    if (btnTodos) btnTodos.classList.add('active');

    atualizarGridPrincipal();
    atualizarRodape();

    document.getElementById('sidebarCollapse').onclick = () => {
        document.getElementById('sidebar').classList.add('active');
    };

    document.getElementById('btnCloseSidebar').onclick = () => {
        document.getElementById('sidebar').classList.remove('active');
    };

    document.addEventListener('click', function(event) {
        const sidebar = document.getElementById('sidebar');
        const btnCollapse = document.getElementById('sidebarCollapse');
        if (sidebar && sidebar.classList.contains('active')) {
            if (!sidebar.contains(event.target) && !btnCollapse.contains(event.target)) {
                sidebar.classList.remove('active');
            }
        }
    });

    document.getElementById('darkModeToggle').onchange = (e) => {
        document.documentElement.setAttribute('data-bs-theme', e.target.checked ? 'dark' : 'light');
    };
    
    document.getElementById('inputNovoCliente').addEventListener('input', () => {
        limiteExibicao = 25; 
        atualizarGridPrincipal();
    });
};

/* --- LÓGICA DE ROLAGEM INTELIGENTE --- */
const btnScrollTop = document.getElementById('btnScrollTop');
const btnScrollBottom = document.getElementById('btnScrollBottom');

window.onscroll = function() {
    const scrolled = document.documentElement.scrollTop || document.body.scrollTop;
    const windowHeight = document.documentElement.clientHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const screenWidth = window.innerWidth;

    if (scrolled > 300) {
        btnScrollTop.classList.add('visible');
    } else {
        btnScrollTop.classList.remove('visible');
    }

    const distanceToBottom = documentHeight - (scrolled + windowHeight);
    const notAtBottom = distanceToBottom > 150; 
    const isLista = document.getElementById('telalista').classList.contains('show');

    const limiteMinimo = screenWidth <= 768 ? 50 : 75;

    if (notAtBottom && ((isLista && limiteExibicao >= limiteMinimo) || !isLista)) {
        btnScrollBottom.classList.add('visible');
    } else {
        btnScrollBottom.classList.remove('visible');
    }
};

btnScrollTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

if (btnScrollBottom) {
    btnScrollBottom.addEventListener('click', () => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });
}

function abrirChecklist(id) {
    entidadeAtiva = id;
    const lista = document.getElementById('telalista');
    const avaliacao = document.getElementById('telaAvaliacao');
    lista.classList.remove('show');
    
    const btnHelp = document.querySelector('.btn-floating-help');
    if (btnHelp) btnHelp.style.display = 'flex'; 
    const btnTop = document.getElementById('btnScrollTop');
    if (btnTop) btnTop.classList.add('empurrado'); 
    const btnBottom = document.getElementById('btnScrollBottom');
    if (btnBottom) btnBottom.classList.add('empurrado'); 

    setTimeout(() => {
        lista.style.display = 'none'; 
        avaliacao.style.display = 'block'; 
        document.getElementById('nomeEntidadeAtiva').innerText = db[id].nome;
        renderizarGrupos();
        window.scrollTo(0,0);
        setTimeout(() => { avaliacao.classList.add('show'); }, 20); 
    }, 200); 
}

function voltarParaInicio() {
    const lista = document.getElementById('telalista');
    const avaliacao = document.getElementById('telaAvaliacao');
    avaliacao.classList.remove('show');
    
    const btnHelp = document.querySelector('.btn-floating-help');
    if (btnHelp) btnHelp.style.display = 'none'; 
    const btnTop = document.getElementById('btnScrollTop');
    if (btnTop) btnTop.classList.remove('empurrado');
    const btnBottom = document.getElementById('btnScrollBottom');
    if (btnBottom) btnBottom.classList.remove('empurrado'); 

    setTimeout(() => {
        avaliacao.style.display = 'none';
        lista.style.display = 'block';
        atualizarGridPrincipal();
        window.scrollTo(0,0);
        setTimeout(() => { lista.classList.add('show'); }, 20);
    }, 200); 
}

// Expõe as funções para o HTML
window.voltarParaInicio = voltarParaInicio;
window.abrirChecklist = abrirChecklist;
window.definirFiltro = definirFiltro;
window.atualizarGridPrincipal = atualizarGridPrincipal;
window.carregarMaisCidades = carregarMaisCidades;
window.exibirTodosOsCards = exibirTodosOsCards;
window.executarCadastroModal = executarCadastroModal;
window.cadastrarEntidade = cadastrarEntidade;
window.prepararEdicao = prepararEdicao;
window.confirmarEdicao = confirmarEdicao;
window.confirmarExclusao = confirmarExclusao;
window.executarExclusao = executarExclusao;
window.marcarTodoOGrupo = marcarTodoOGrupo;
window.desmarcarTodoOGrupo = desmarcarTodoOGrupo;
window.toggleCheck = toggleCheck;
window.exportarDados = exportarDados;
window.importarDados = importarDados;
window.abrirAjuda = abrirAjuda;

window.logout = function() {
    document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = '/login.html';
};

function abrirAjuda() {
    new bootstrap.Modal(document.getElementById('modalAjuda')).show();
    document.getElementById('sidebar').classList.remove('active');
}

function definirFiltro(tipo) { 
    filtroAtivo = tipo; 
    limiteExibicao = 25; 
    const botoes = document.querySelectorAll('.btn-filtro-poder');
    botoes.forEach(btn => btn.classList.remove('active'));
    if (tipo === 'todos') document.getElementById('btn-todos').classList.add('active');
    else if (tipo === 'prefeitura') document.getElementById('btn-prefeitura').classList.add('active');
    else if (tipo === 'camara') document.getElementById('btn-camara').classList.add('active');
    atualizarGridPrincipal(); 
}

function atualizarGridPrincipal() {
    const grid = document.getElementById('gridClientes');
    const containerBotoes = document.getElementById('containerCarregarMais');
    const termo = normalizarTexto(document.getElementById('inputNovoCliente').value);
    
    const operadorFiltro = document.getElementById('selectFiltroOperador').value;
    const seloFiltro = document.getElementById('selectFiltroSelo') ? document.getElementById('selectFiltroSelo').value : 'todos';
    const controladorFiltro = document.getElementById('selectFiltroControlador') ? document.getElementById('selectFiltroControlador').value : 'todos';
    
    grid.innerHTML = "";
    
    const itensFiltrados = Object.keys(db).filter(id => {
        const ent = db[id];
        const nomeParaBusca = normalizarTexto(ent.nome);
        
        const passaTexto = nomeParaBusca.includes(termo);
        const passaOperador = (operadorFiltro === 'todos') || (ent.operador === operadorFiltro);
        const passaSelo = (seloFiltro === 'todos') || (ent.selo === seloFiltro);
        
        let passaControlador = true;
        if (controladorFiltro === 'com') {
            passaControlador = (ent.controlador && ent.controlador.trim() !== "");
        } else if (controladorFiltro === 'sem') {
            passaControlador = (!ent.controlador || ent.controlador.trim() === "");
        }
        
        const ehPrefeitura = nomeParaBusca.includes('prefeitura');
        const ehCamara = normalizarTexto(ent.nome).includes('camara'); 
        const passaPoder = (filtroAtivo === 'todos') || 
                           (filtroAtivo === 'prefeitura' && ehPrefeitura) || 
                           (filtroAtivo === 'camara' && ehCamara);
                           
        return passaTexto && passaOperador && passaSelo && passaControlador && passaPoder;
    });

    const itensParaExibir = itensFiltrados.slice(0, limiteExibicao);

    itensParaExibir.forEach(id => {
        const ent = db[id];
        const slug = normalizarTexto(ent.selo);
        
        const foneLimpo = ent.telefone ? ent.telefone.replace(/\D/g, '') : "";
        const btnWhats = foneLimpo ? `<a href="https://wa.me/55${foneLimpo}" target="_blank" class="text-success ms-2" title="Chamar no WhatsApp" style="font-size: 1.1rem;"><i class="bi bi-whatsapp"></i></a>` : "";

        grid.innerHTML += `
            <div class="col-md-4">
                <div class="card shadow-sm border-0 p-3 h-100 dark-card-target">
                    <div class="mb-2">
                        <span class="badge-operador">${ent.operador || 'ASSESI'}</span>
                    </div>
                    <h6 class="fw-bold mb-1">${ent.nome}</h6>
                    
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <span class="text-muted small" style="font-size: 0.75rem;">Controlador: ${ent.controlador || '---'}</span>
                        ${btnWhats}
                    </div>

                    <div class="badge w-100 mb-3 p-2 selo-${slug}">${ent.selo} (${ent.perc}%)</div>
                    <div class="d-flex gap-2">
                        <button onclick="abrirChecklist('${id}')" class="btn btn-primary btn-sm flex-grow-1 fw-bold">Avaliar</button>
                        <button onclick="prepararEdicao('${id}')" class="btn btn-outline-secondary btn-sm" title="Editar Contatos e Nome"><i class="bi bi-pencil"></i></button>
                        <button onclick="confirmarExclusao('${id}')" class="btn btn-outline-danger btn-sm"><i class="bi bi-trash"></i></button>
                    </div>
                </div>
            </div>`;
    });

    if (containerBotoes) {
        if (itensFiltrados.length <= limiteExibicao) {
            containerBotoes.style.display = 'none';
        } else {
            containerBotoes.style.display = 'block';
        }
    }

    window.dispatchEvent(new Event('scroll'));
    atualizarRodape();
}

function carregarMaisCidades() {
    limiteExibicao += 25;
    atualizarGridPrincipal();
}

function exibirTodosOsCards() {
    limiteExibicao = 9999;
    atualizarGridPrincipal();
}

function executarCadastroModal() {
    const nomeInput = document.getElementById('inputModalNome');
    const operadorSelect = document.getElementById('selectModalOperador');
    const controladorInput = document.getElementById('inputModalControlador');
    const telefoneInput = document.getElementById('inputModalTelefone');
    
    const nomeOriginal = nomeInput.value.trim().toUpperCase();
    const operadorEscolhido = operadorSelect.value;
    const ctrlEscolhido = controladorInput ? controladorInput.value.trim() : "";
    const foneEscolhido = telefoneInput ? telefoneInput.value.trim() : "";
    
    if (!nomeOriginal || !operadorEscolhido) { alert("Preencha os campos obrigatórios (Nome e Operador)."); return; }
    
    const jaExiste = Object.values(db).some(ent => normalizarTexto(ent.nome).replace(/\s/g, "") === normalizarTexto(nomeOriginal).replace(/\s/g, ""));
    if (jaExiste) { alert("⚠️ Esta entidade já está cadastrada!"); return; }
    
    const id = "ENT_" + Date.now();
    db[id] = { 
        nome: nomeOriginal, 
        operador: operadorEscolhido, 
        controlador: ctrlEscolhido, 
        telefone: foneEscolhido, 
        perc: 0, 
        selo: "INEXISTENTE", 
        marcados: {} 
    };
    salvar();
    
    nomeInput.value = "";
    operadorSelect.selectedIndex = 0;
    if (controladorInput) controladorInput.value = "";
    if (telefoneInput) telefoneInput.value = "";
    
    bootstrap.Modal.getInstance(document.getElementById('modalNovoCadastro')).hide();
    atualizarGridPrincipal();
}

function cadastrarEntidade() {
    new bootstrap.Modal(document.getElementById('modalNovoCadastro')).show();
}

function prepararEdicao(id) {
    idParaEditar = id;
    document.getElementById('inputEditNome').value = db[id].nome;
    const inputCtrl = document.getElementById('inputEditControlador');
    const inputFone = document.getElementById('inputEditTelefone');
    
    if (inputCtrl) inputCtrl.value = db[id].controlador || "";
    if (inputFone) inputFone.value = db[id].telefone || "";
    
    new bootstrap.Modal(document.getElementById('modalEditarEntidade')).show();
}

function confirmarEdicao() {
    const novoNome = document.getElementById('inputEditNome').value.trim().toUpperCase();
    const inputCtrl = document.getElementById('inputEditControlador');
    const inputFone = document.getElementById('inputEditTelefone');
    
    if (novoNome && idParaEditar) {
        db[idParaEditar].nome = novoNome;
        if (inputCtrl) db[idParaEditar].controlador = inputCtrl.value.trim();
        if (inputFone) db[idParaEditar].telefone = inputFone.value.trim();
        
        salvar();
        atualizarGridPrincipal();
        bootstrap.Modal.getInstance(document.getElementById('modalEditarEntidade')).hide();
    }
}

function confirmarExclusao(id) {
    idParaExcluir = id;
    new bootstrap.Modal(document.getElementById('modalConfirmarExclusao')).show();
}

function executarExclusao() {
    if(idParaExcluir) {
        delete db[idParaExcluir];
        salvar();
        bootstrap.Modal.getInstance(document.getElementById('modalConfirmarExclusao')).hide();
        atualizarGridPrincipal();
    }
}

/* --- REESTRUTURAÇÃO DO HTML DOS GRUPOS PARA RESPONSIVIDADE TOTAL --- */
function renderizarGrupos() {
    const container = document.getElementById('containerGrupos');
    container.innerHTML = "";
    const ent = db[entidadeAtiva];
    const ehCamara = normalizarTexto(ent.nome).includes('camara');
    
    GRUPOS_CRITERIOS.forEach((grupo, index) => {
        const num = parseInt(grupo.titulo);
        if (ehCamara && [16, 17, 18, 19].includes(num)) return;
        if (!ehCamara && num === 20) return;
        
        const collapseId = `collapse_grupo_${index}`;

        // Usa flex-column no mobile e flex-md-row no computador
        let html = `<div class="grupo-header d-flex flex-column flex-md-row justify-content-between align-items-md-center mt-4" style="padding: 12px 16px;">
            <span style="cursor: pointer; user-select: none;" data-bs-toggle="collapse" data-bs-target="#${collapseId}" title="Clique para minimizar/maximizar" class="text-white fw-bold mb-3 mb-md-0">
                <i class="bi bi-caret-down-fill me-1 opacity-75"></i> ${grupo.titulo}
            </span>
            <div class="d-flex justify-content-between align-items-center w-100" style="max-width: 400px;">
                <div class="d-flex gap-2">
                    <button onclick="marcarTodoOGrupo('${grupo.titulo}')" class="btn btn-sm btn-primary px-2 py-1 shadow-sm" style="font-size: 0.75rem;">Marcar Tudo</button>
                    <button onclick="desmarcarTodoOGrupo('${grupo.titulo}')" class="btn btn-sm btn-secondary px-2 py-1 shadow-sm" style="font-size: 0.75rem;">Desmarcar</button>
                </div>
                <div class="d-flex" style="width: 120px; flex-shrink: 0;">
                    <div style="width: 40px; text-align: center;" class="fw-bold text-white">D</div>
                    <div style="width: 40px; text-align: center;" class="fw-bold text-white">A</div>
                    <div style="width: 40px; text-align: center;" class="fw-bold text-white">S</div>
                </div>
            </div>
        </div>
        
        <div class="collapse show" id="${collapseId}">
            <ul class="list-group mb-3">`;

        grupo.itens.forEach(item => {
            const st = ent.marcados[item.id] || { g: false, s: false, a: false };
            const exige = item.exige || ['g', 's', 'a'];
            
            const checkD = `<div class="d-flex justify-content-center align-items-center" style="width: 40px;"><input type="checkbox" ${st.g?'checked':''} onchange="toggleCheck('${item.id}', 'g')" class="form-check-input m-0 border-secondary" style="cursor: pointer; width: 1.2rem; height: 1.2rem; ${exige.includes('g') ? '' : 'visibility: hidden;'}"></div>`;
            const checkA = `<div class="d-flex justify-content-center align-items-center" style="width: 40px;"><input type="checkbox" ${st.s?'checked':''} onchange="toggleCheck('${item.id}', 's')" class="form-check-input m-0 border-secondary" style="cursor: pointer; width: 1.2rem; height: 1.2rem; ${exige.includes('s') ? '' : 'visibility: hidden;'}"></div>`;
            const checkS = `<div class="d-flex justify-content-center align-items-center" style="width: 40px;"><input type="checkbox" ${st.a?'checked':''} onchange="toggleCheck('${item.id}', 'a')" class="form-check-input m-0 border-secondary" style="cursor: pointer; width: 1.2rem; height: 1.2rem; ${exige.includes('a') ? '' : 'visibility: hidden;'}"></div>`;
            
            // Mantém na mesma linha mas evita espremer usando flex-shrink-0 na div das caixinhas
            html += `<li class="list-group-item d-flex align-items-center dark-card-target" style="padding: 12px 16px;">
                <div class="flex-grow-1 pe-3" style="font-size: 0.9rem;">
                    <small class="text-muted fw-bold">${item.id}</small> ${item.classificacao === 'essencial' ? '<b class="text-danger" title="Critério Essencial">*</b>' : ''} 
                    <br><span class="d-block mt-1">${item.nome}</span>
                </div>
                <div class="d-flex" style="width: 120px; flex-shrink: 0;">${checkD}${checkA}${checkS}</div>
            </li>`;
        });
        
        container.innerHTML += html + "</ul></div>";
    });
    calcularProgresso();
}

function toggleCheck(id, tipo) {
    const ent = db[entidadeAtiva];
    if (!ent.marcados[id]) ent.marcados[id] = { g: false, s: false, a: false };
    ent.marcados[id][tipo] = !ent.marcados[id][tipo];
    salvar();
    calcularProgresso();
}

function marcarTodoOGrupo(tituloGrupo) {
    const grupo = GRUPOS_CRITERIOS.find(g => g.titulo === tituloGrupo);
    if (!grupo) return;
    const ent = db[entidadeAtiva];
    grupo.itens.forEach(item => {
        if (!ent.marcados[item.id]) ent.marcados[item.id] = { g: false, s: false, a: false };
        const exige = item.exige || ['g', 's', 'a'];
        if (exige.includes('g')) ent.marcados[item.id].g = true;
        if (exige.includes('s')) ent.marcados[item.id].s = true;
        if (exige.includes('a')) ent.marcados[item.id].a = true;
    });
    salvar();
    renderizarGrupos(); 
}

function desmarcarTodoOGrupo(tituloGrupo) {
    const grupo = GRUPOS_CRITERIOS.find(g => g.titulo === tituloGrupo);
    if (!grupo) return;
    const ent = db[entidadeAtiva];
    grupo.itens.forEach(item => {
        if (ent.marcados[item.id]) ent.marcados[item.id] = { g: false, s: false, a: false };
    });
    salvar();
    renderizarGrupos();
}

function calcularProgresso() {
    const ent = db[entidadeAtiva];
    let pontosTotais = 0, pontosObtidos = 0, faltaEssencial = false;
    const ehCamara = normalizarTexto(ent.nome).includes('camara');
    GRUPOS_CRITERIOS.forEach(g => {
        const num = parseInt(g.titulo);
        if (ehCamara && [16, 17, 18, 19].includes(num)) return;
        if (!ehCamara && num === 20) return;
        let pesoDim = g.pesoDimensao || 1; 
        g.itens.forEach(i => {
            let pesoCrit = i.classificacao === 'essencial' ? 2 : (i.classificacao === 'obrigatoria' ? 1.5 : 1);
            let pontosDesteCriterio = pesoDim * pesoCrit;
            pontosTotais += pontosDesteCriterio;
            const s = ent.marcados[i.id] || {g:false, s:false, a:false};
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
    ent.perc = perc; ent.selo = selo;
    document.getElementById('progressoTexto').innerText = perc + "%";
    document.getElementById('barraProgresso').style.width = perc + "%";
    const b = document.getElementById('statusSelo');
    if (b) { b.innerText = selo; b.className = `badge p-3 fs-6 rounded-pill selo-${normalizarTexto(selo)}`; }
}

function atualizarRodape() {
    const total = Object.keys(db).length;
    const avaliados = Object.values(db).filter(e => e.perc > 0).length;
    const footer = document.getElementById('footerStatus');
    if (footer) footer.innerHTML = `<span><b>${avaliados}</b> de ${total} entidades</span><span>© 2026 TD2 - Simulador de Transparência Atricon</span>`;
}

function exportarDados() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(db));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "backup_atricon_2026.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function importarDados(event) {
    const arquivo = event.target.files[0];
    if (!arquivo) return;
    const leitor = new FileReader();
    leitor.onload = async function(e) {
        try {
            const dadosImportados = JSON.parse(e.target.result);
            if (typeof dadosImportados === 'object' && dadosImportados !== null) {
                if (confirm("Isso substituirá todos os dados na NUVEM. Deseja continuar?")) {
                    db = dadosImportados; 
                    await salvar(); 
                    atualizarGridPrincipal();
                    alert("Dados importados com sucesso para a nuvem!"); 
                    window.location.reload(); 
                }
            }
        } catch (err) { alert("Erro ao ler o arquivo JSON."); }
    };
    leitor.readAsText(arquivo);
}