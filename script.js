const GRUPOS_CRITERIOS = [
    {
        titulo: "1. Informações Institucionais e Acessibilidade",
        itens: [
            { id: "1.1", nome: "Estrutura Organizacional e Competências", essencial: true },
            { id: "1.2", nome: "Ferramenta de Pesquisa e Acessibilidade", essencial: true },
            { id: "1.3", nome: "Perguntas Frequentes (FAQ)", essencial: false }
        ]
    },
    {
        titulo: "2. Receitas Públicas",
        itens: [
            { id: "2.1", nome: "Receitas Previstas e Arrecadadas", essencial: true },
            { id: "2.2", nome: "Receitas por Natureza e Fonte", essencial: true }
        ]
    },
    {
        titulo: "3. Despesas Públicas",
        itens: [
            { id: "3.1", nome: "Despesas Empenhadas, Liquidadas e Pagas", essencial: true },
            { id: "3.2", nome: "Favorecidos (Pessoa Física e Jurídica)", essencial: true }
        ]
    },
    {
        titulo: "4. Licitações",
        itens: [
            { id: "4.1", nome: "Editais e Anexos na íntegra", essencial: true },
            { id: "4.2", nome: "Resultados e Homologações", essencial: true }
        ]
    },
    {
        titulo: "5. Contratos",
        itens: [
            { id: "5.1", nome: "Íntegra dos Contratos e Aditivos", essencial: true },
            { id: "5.2", nome: "Acompanhamento da Execução Contratual", essencial: true }
        ]
    },
    {
        titulo: "6. Convênios e Transferências",
        itens: [
            { id: "6.1", nome: "Convênios Recebidos e Cedidos", essencial: false },
            { id: "6.2", nome: "Transferências Voluntárias", essencial: false }
        ]
    },
    {
        titulo: "7. Recursos Humanos",
        itens: [
            { id: "7.1", nome: "Folha de Pagamento Nominal", essencial: true },
            { id: "7.2", nome: "Diárias e Passagens", essencial: true }
        ]
    },
    {
        titulo: "8. Planejamento (PPA, LDO e LOA)",
        itens: [
            { id: "8.1", nome: "Leis Orçamentárias (PPA/LDO/LOA)", essencial: true },
            { id: "8.2", nome: "Audiências Públicas e Relatórios", essencial: true }
        ]
    },
    {
        titulo: "9. Gestão Fiscal (RREO e RGF)",
        itens: [
            { id: "9.1", nome: "Relatórios de Execução Orçamentária", essencial: true },
            { id: "9.2", nome: "Relatórios de Gestão Fiscal", essencial: true }
        ]
    },
    {
        titulo: "10. Prestação de Contas",
        itens: [
            { id: "10.1", nome: "Relatório de Gestão e Parecer Prévio", essencial: true },
            { id: "10.2", nome: "Julgamento de Contas", essencial: true }
        ]
    },
    {
        titulo: "11. Serviço de Informação ao Cidadão (e-SIC)",
        itens: [
            { id: "11.1", nome: "Acesso ao Pedido de Informação Online", essencial: true },
            { id: "11.2", nome: "Relatório Estatístico de Pedidos", essencial: true }
        ]
    },
    {
        titulo: "12. Ouvidoria",
        itens: [
            { id: "12.1", nome: "Canal de Contato e Ouvidoria", essencial: true },
            { id: "12.2", nome: "Relatórios de Ouvidoria", essencial: false }
        ]
    },
    {
        titulo: "13. Obras Públicas",
        itens: [
            { id: "13.1", nome: "Acompanhamento de Obras", essencial: false }
        ]
    },
    {
        titulo: "14. Diárias e Passagens",
        itens: [
            { id: "14.1", nome: "Publicação de Valores e Destinos", essencial: true }
        ]
    },
    {
        titulo: "15. Sanções Administrativas",
        itens: [
            { id: "15.1", nome: "Relação de Sanções a Empresas", essencial: false }
        ]
    },
    {
        titulo: "16. Renúncia de Receita",
        itens: [
            { id: "16.1", nome: "Benefícios Fiscais Concedidos", essencial: false },
            { id: "16.4", nome: "Projetos de Incentivo à Cultura", essencial: false }
        ]
    },
    {
        titulo: "17. Emendas Parlamentares",
        itens: [
            { id: "17.1", nome: "Identificação das Emendas Recebidas", essencial: true },
            { id: "17.2", nome: "Execução das 'Emendas Pix'", essencial: true }
        ]
    },
    {
        titulo: "18. Saúde",
        itens: [
            { id: "18.1", nome: "Plano de Saúde e Relatórios", essencial: true },
            { id: "18.2", nome: "Horários e Especialidades Médicas", essencial: true },
            { id: "18.3", nome: "Lista de Espera de Regulação", essencial: true },
            { id: "18.4", nome: "Relação de Medicamentos (SUS)", essencial: true },
            { id: "18.5", nome: "Estoque das Farmácias Públicas", essencial: true }
        ]
    },
    {
        titulo: "19. Educação",
        itens: [
            { id: "19.1", nome: "Plano de Educação e Resultados", essencial: true },
            { id: "19.2", nome: "Lista de Espera em Creches e Priorização", essencial: true }
        ]
    }
];

const DATA_ENTIDADES = [
    {n:"PREFEITURA MUNICIPAL DE MAURITI", o:"CLEYDIR"}, {n:"PREFEITURA MUNICIPAL DE AMONTADA", o:"CLEYDIR"}, {n:"PREFEITURA MUNICIPAL DE CAMPOS SALES", o:"CLEYDIR"}, {n:"PREFEITURA MUNICIPAL DE SÃO BENEDITO", o:"CLEYDIR"}, {n:"PREFEITURA MUNICIPAL DE REDENÇÃO", o:"CLEYDIR"}, {n:"PREFEITURA MUNICIPAL DE PENTECOSTE", o:"CLEYDIR"}, {n:"PREFEITURA MUNICIPAL DE CRATEÚS", o:"CLEYDIR"}, {n:"PREFEITURA MUNICIPAL DE CASCAVEL", o:"CLEYDIR"}, {n:"PREFEITURA MUNICIPAL DE PEDRA BRANCA", o:"CLEYDIR"}, {n:"PREFEITURA MUNICIPAL DE MILHÃ", o:"CLEYDIR"}, {n:"PREFEITURA MUNICIPAL DE MADALENA", o:"CLEYDIR"}, {n:"PREFEITURA MUNICIPAL DE VIÇOSA DO CEARÁ", o:"CLEYDIR"}, {n:"PREFEITURA MUNICIPAL DE MONSENHOR TABOSA", o:"CLEYDIR"}, {n:"PREFEITURA MUNICIPAL DE SABOEIRO", o:"CLEYDIR"}, {n:"PREFEITURA MUNICIPAL DE MARTINÓPOLE", o:"CLEYDIR"}, {n:"PREFEITURA MUNICIPAL DE JIJOCA DE JERICOACOARA", o:"CLEYDIR"}, {n:"PREFEITURA MUNICIPAL DE HIDROLÂNDIA", o:"CLEYDIR"}, {n:"PREFEITURA MUNICIPAL DE GRANJEIRO", o:"CLEYDIR"}, {n:"PREFEITURA MUNICIPAL DE CARIDADE", o:"CLEYDIR"}, {n:"PREFEITURA MUNICIPAL DE CHORÓ", o:"CLEYDIR"}, {n:"PREFEITURA MUNICIPAL DE CAPISTRANO", o:"CLEYDIR"}, {n:"PREFEITURA MUNICIPAL DE BEBERIBE", o:"CLEYDIR"}, {n:"PREFEITURA MUNICIPAL DE APUIARÉS", o:"CLEYDIR"},
    {n:"PREFEITURA MUNICIPAL DE IPAUMIRIM", o:"DAVI"}, {n:"PREFEITURA MUNICIPAL DE GUAIÚBA", o:"DAVI"}, {n:"PREFEITURA MUNICIPAL DE GENERAL SAMPAIO", o:"DAVI"}, {n:"PREFEITURA MUNICIPAL DE IPUEIRAS", o:"DAVI"}, {n:"PREFEITURA MUNICIPAL DE PALMÁCIA", o:"DAVI"}, {n:"PREFEITURA MUNICIPAL DE ITATIRA", o:"DAVI"}, {n:"PREFEITURA MUNICIPAL DE IPAPORANGA", o:"DAVI"}, {n:"PREFEITURA MUNICIPAL DE IBIAPINA", o:"DAVI"}, {n:"PREFEITURA MUNICIPAL DE ACARAPE", o:"DAVI"}, {n:"PREFEITURA MUNICIPAL DE IPU", o:"DAVI"}, {n:"PREFEITURA MUNICIPAL DE SÃO GONÇALO DO AMARANTE", o:"DAVI"}, {n:"PREFEITURA MUNICIPAL DE PARACURU", o:"DAVI"}, {n:"PREFEITURA MUNICIPAL DE IBICUITINGA", o:"DAVI"}, {n:"PREFEITURA MUNICIPAL DE AQUIRAZ", o:"DAVI"}, {n:"PREFEITURA MUNICIPAL DE QUIXELÔ", o:"DAVI"}, {n:"PREFEITURA MUNICIPAL DE ICÓ", o:"DAVI"}, {n:"PREFEITURA MUNICIPAL DE CAUCAIA", o:"DAVI"}, {n:"PREFEITURA MUNICIPAL DE SÃO JOÃO DO JAGUARIBE", o:"DAVI"}, {n:"PREFEITURA MUNICIPAL DE QUITERIANÓPOLIS", o:"DAVI"}, {n:"PREFEITURA MUNICIPAL DE PARAIPABA", o:"DAVI"}, {n:"PREFEITURA MUNICIPAL DE MERUOCA", o:"DAVI"}, {n:"PREFEITURA MUNICIPAL DE URUOCA", o:"DAVI"}, {n:"PREFEITURA MUNICIPAL DE PACAJUS", o:"DAVI"}, {n:"PREFEITURA MUNICIPAL DE SALITRE", o:"DAVI"}, {n:"PREFEITURA MUNICIPAL DE SANTANA DO ACARAÚ", o:"DAVI"}, {n:"PREFEITURA MUNICIPAL DE CEDRO", o:"DAVI"},
    {n:"PREFEITURA MUNICIPAL DE ERERE", o:"FELIPE"}, {n:"PREFEITURA MUNICIPAL DE GUARAMIRANGA", o:"FELIPE"}, {n:"PREFEITURA MUNICIPAL DE BATURITÉ", o:"FELIPE"}, {n:"PREFEITURA MUNICIPAL DE COREAÚ", o:"FELIPE"}, {n:"PREFEITURA MUNICIPAL DE IRACEMA", o:"FELIPE"}, {n:"PREFEITURA MUNICIPAL DE ORÓS", o:"FELIPE"}, {n:"PREFEITURA MUNICIPAL DE IRAUÇUBA", o:"FELIPE"}, {n:"PREFEITURA MUNICIPAL DE ACARAÚ", o:"FELIPE"}, {n:"PREFEITURA MUNICIPAL DE SENADOR POMPEU", o:"FELIPE"}, {n:"PREFEITURA MUNICIPAL DE ITAIÇABA", o:"FELIPE"}, {n:"PREFEITURA MUNICIPAL DE EUSÉBIO", o:"FELIPE"}, {n:"PREFEITURA MUNICIPAL DE UMARI", o:"FELIPE"}, {n:"PREFEITURA MUNICIPAL DE UBAJARA", o:"FELIPE"}, {n:"PREFEITURA MUNICIPAL DE ACOPIARA", o:"FELIPE"}, {n:"PREFEITURA MUNICIPAL DE VARZEA ALEGRE", o:"FELIPE"}, {n:"PREFEITURA MUNICIPAL DE TAUÁ", o:"FELIPE"}, {n:"PREFEITURA MUNICIPAL DE RUSSAS", o:"FELIPE"}, {n:"PREFEITURA MUNICIPAL DE TRAIRI", o:"FELIPE"}, {n:"PREFEITURA MUNICIPAL DE TAMBORIL", o:"FELIPE"}, {n:"PREFEITURA MUNICIPAL DE MOMBAÇA", o:"FELIPE"}, {n:"PREFEITURA MUNICIPAL DE JARDIM", o:"FELIPE"}, {n:"PREFEITURA MUNICIPAL DE DEP. IRAPUAN PINHEIRO", o:"FELIPE"}, {n:"PREFEITURA MUNICIPAL DE URUBURETAMA", o:"FELIPE"}, {n:"PREFEITURA MUNICIPAL DE LAVRAS DA MANGABEIRA", o:"FELIPE"}, {n:"PREFEITURA MUNICIPAL DE FRECHEIRINHA", o:"FELIPE"}, {n:"PREFEITURA MUNICIPAL DE BAIXIO", o:"FELIPE"},
    {n:"PREFEITURA MUNICIPAL DE CRATO", o:"JOÃO"}, {n:"PREFEITURA MUNICIPAL DE QUIXERAMOBIM", o:"JOÃO"}, {n:"SECRETARIA DE EDUCACAO DE JAGUARETAMA", o:"JOÃO"}, {n:"PREFEITURA MUNICIPAL DE ITAPIUNA", o:"JOÃO"}, {n:"PREFEITURA MUNICIPAL DE MORRINHOS", o:"JOÃO"}, {n:"PREFEITURA MUNICIPAL DE ARACATI", o:"JOÃO"}, {n:"PREFEITURA MUNICIPAL DE VARJOTA", o:"JOÃO"}, {n:"PREFEITURA MUNICIPAL DE OCARA", o:"JOÃO"}, {n:"PREFEITURA MUNICIPAL DE MASSAPÊ", o:"JOÃO"}, {n:"PREFEITURA MUNICIPAL DE LIMOEIRO DO NORTE", o:"JOÃO"}, {n:"PREFEITURA MUNICIPAL DE ALTANEIRA", o:"JOÃO"}, {n:"PREFEITURA MUNICIPAL DE GRAÇA", o:"JOÃO"}, {n:"PREFEITURA MUNICIPAL DE PARAMOTI", o:"JOÃO"}, {n:"PREFEITURA MUNICIPAL DE MORADA NOVA", o:"JOÃO"}, {n:"PREFEITURA MUNICIPAL DE HORIZONTE", o:"JOÃO"}, {n:"PREFEITURA MUNICIPAL DE GRANJA", o:"JOÃO"}, {n:"PREFEITURA MUNICIPAL DE FORQUILHA", o:"JOÃO"}, {n:"PREFEITURA MUNICIPAL DE PINDORETAMA", o:"JOÃO"}, {n:"PREFEITURA MUNICIPAL DE NOVA RUSSAS", o:"JOÃO"}, {n:"PREFEITURA MUNICIPAL DE ITAPAJÉ", o:"JOÃO"}, {n:"PREFEITURA MUNICIPAL DE TURURU", o:"JOÃO"}, {n:"PREFEITURA MUNICIPAL DE SANTA QUITÉRIA", o:"JOÃO"}, {n:"PREFEITURA MUNICIPAL DE MARANGUAPE", o:"JOÃO"}, {n:"PREFEITURA MUNICIPAL DE CANINDÉ", o:"JOÃO"}, {n:"PREFEITURA MUNICIPAL DE AURORA", o:"JOÃO"},
    {n:"PREFEITURA MUNICIPAL DE ICAPUÍ", o:"KAIKE"}, {n:"PREFEITURA MUNICIPAL DE PEREIRO", o:"KAIKE"}, {n:"PREFEITURA MUNICIPAL DE QUIXERÉ", o:"KAIKE"}, {n:"PREFEITURA MUNICIPAL DE POTENGI", o:"KAIKE"}, {n:"PREFEITURA MUNICIPAL DE CATARINA", o:"KAIKE"}, {n:"PREFEITURA MUNICIPAL DE ARATUBA", o:"KAIKE"}, {n:"PREFEITURA MUNICIPAL DE QUIXADA", o:"KAIKE"}, {n:"PREFEITURA MUNICIPAL DE JAGUARETAMA", o:"KAIKE"}, {n:"PREFEITURA MUNICIPAL DE PORANGA", o:"KAIKE"}, {n:"PREFEITURA MUNICIPAL DE CARNAUBAL", o:"KAIKE"}, {n:"PREFEITURA MUNICIPAL DE ARACOIABA", o:"KAIKE"}, {n:"PREFEITURA MUNICIPAL DE ITAPIPOCA", o:"KAIKE"}, {n:"PREFEITURA MUNICIPAL DE AIUABA", o:"KAIKE"}, {n:"PREFEITURA MUNICIPAL DE TIANGUÁ", o:"KAIKE"}, {n:"PREFEITURA MUNICIPAL DE JUAZEIRO DO NORTE", o:"KAIKE"}, {n:"PREFEITURA MUNICIPAL DE ITAREMA", o:"KAIKE"}, {n:"PREFEITURA MUNICIPAL DE ITAITINGA", o:"KAIKE"}, {n:"PREFEITURA MUNICIPAL DE FORTIM", o:"KAIKE"}, {n:"PREFEITURA MUNICIPAL DE PACOTI", o:"KAIKE"}, {n:"PREFEITURA MUNICIPAL DE MARCO", o:"KAIKE"}, {n:"PREFEITURA MUNICIPAL DE BARBALHA", o:"KAIKE"}, {n:"PREFEITURA MUNICIPAL DE ASSARÉ", o:"KAIKE"}, {n:"PREFEITURA MUNICIPAL DE JAGUARUANA", o:"KAIKE"}, {n:"PREFEITURA MUNICIPAL DE CATUNDA", o:"KAIKE"},
    {n:"PREFEITURA MUNICIPAL DE BELA CRUZ", o:"KAIRON"}, {n:"PREFEITURA MUNICIPAL DE BOA VIAGEM", o:"KAIRON"}, {n:"PREFEITURA MUNICIPAL DE ALTO SANTO", o:"KAIRON"}, {n:"PREFEITURA MUNICIPAL DE PIQUET CARNEIRO", o:"KAIRON"}, {n:"PREFEITURA MUNICIPAL DE PALHANO", o:"KAIRON"}, {n:"PREFEITURA MUNICIPAL DE INDEPENDENCIA", o:"KAIRON"}, {n:"PREFEITURA MUNICIPAL DE TEJUÇUOCA", o:"KAIRON"}, {n:"PREFEITURA MUNICIPAL DE SANTANA DO CARIRI", o:"KAIRON"}, {n:"PREFEITURA MUNICIPAL DE POTIRETAMA", o:"KAIRON"}, {n:"PREFEITURA MUNICIPAL DE NOVO ORIENTE", o:"KAIRON"}, {n:"PREFEITURA MUNICIPAL DE MIRAÍMA", o:"KAIRON"}, {n:"PREFEITURA MUNICIPAL DE MILAGRES", o:"KAIRON"}, {n:"PREFEITURA MUNICIPAL DE GUARACIABA DO NORTE", o:"KAIRON"}, {n:"PREFEITURA MUNICIPAL DE CARIRIAÇU", o:"KAIRON"}, {n:"PREFEITURA MUNICIPAL DE BARREIRA", o:"KAIRON"}, {n:"PREFEITURA MUNICIPAL DE TABULEIRO DO NORTE", o:"KAIRON"}, {n:"PREFEITURA MUNICIPAL DE SOLONÓPOLE", o:"KAIRON"}, {n:"PREFEITURA MUNICIPAL DE JAGUARIBE", o:"KAIRON"}, {n:"PREFEITURA MUNICIPAL DE CARIRÉ", o:"KAIRON"}, {n:"PREFEITURA MUNICIPAL DE PACATUBA", o:"KAIRON"}, {n:"PREFEITURA MUNICIPAL DE BARRO", o:"KAIRON"}
];

// --- LOGICA DE BANCO DE DADOS ---
const DB_KEY = 'assesi_atricon_v3_clean'; 
let db = JSON.parse(localStorage.getItem(DB_KEY)) || {};
let entidadeAtiva = null;
let filtroAtivo = 'todos';
let idParaExcluir = null;
let idParaEditar = null;

function normalizarTexto(texto) {
    return texto.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
}

function salvar() { localStorage.setItem(DB_KEY, JSON.stringify(db)); }

window.onload = () => {
    if (Object.keys(db).length === 0) {
        DATA_ENTIDADES.forEach(item => {
            const id = "ENT_" + item.n.replace(/\s/g, "_");
            db[id] = { nome: item.n, operador: item.o, perc: 0, selo: "INEXISTENTE", marcados: {} };
        });
        salvar();
    }
    
    atualizarGridPrincipal();
    atualizarRodape();

    document.getElementById('sidebarCollapse').onclick = () => {
        document.getElementById('sidebar').classList.add('active');
    };

    document.getElementById('btnCloseSidebar').onclick = () => {
        document.getElementById('sidebar').classList.remove('active');
    };

    document.getElementById('darkModeToggle').onchange = (e) => {
        document.documentElement.setAttribute('data-bs-theme', e.target.checked ? 'dark' : 'light');
    };
    
    document.getElementById('inputNovoCliente').addEventListener('input', atualizarGridPrincipal);
};

// --- LÓGICA DO BOTÃO VOLTAR AO TOPO ---
const btnScrollTop = document.getElementById('btnScrollTop');
window.onscroll = function() {
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        btnScrollTop.classList.add('visible');
    } else {
        btnScrollTop.classList.remove('visible');
    }
};
btnScrollTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// --- TRANSIÇÕES ACELERADAS (200ms) ---
function abrirChecklist(id) {
    entidadeAtiva = id;
    const lista = document.getElementById('telalista');
    const avaliacao = document.getElementById('telaAvaliacao');

    // Inicia fade-out
    lista.classList.remove('show');
    
    setTimeout(() => {
        lista.style.display = 'none'; 
        avaliacao.style.display = 'block'; 
        
        document.getElementById('nomeEntidadeAtiva').innerText = db[id].nome;
        renderizarGrupos();
        window.scrollTo(0,0);

        // Inicia fade-in
        setTimeout(() => {
            avaliacao.classList.add('show');
        }, 20); 
    }, 200); // 200ms
}

function voltarParaInicio() {
    const lista = document.getElementById('telalista');
    const avaliacao = document.getElementById('telaAvaliacao');

    avaliacao.classList.remove('show');

    setTimeout(() => {
        avaliacao.style.display = 'none';
        lista.style.display = 'block';

        atualizarGridPrincipal();
        window.scrollTo(0,0);

        setTimeout(() => {
            lista.classList.add('show');
        }, 20);
    }, 200); // 200ms
}

// --- FUNÇÕES DE INTERFACE ---
function abrirAjuda() {
    const modal = new bootstrap.Modal(document.getElementById('modalAjuda'));
    modal.show();
    document.getElementById('sidebar').classList.remove('active');
}

function definirFiltro(tipo) { 
    filtroAtivo = tipo; 
    atualizarGridPrincipal(); 
}

function atualizarGridPrincipal() {
    const grid = document.getElementById('gridClientes');
    const termo = normalizarTexto(document.getElementById('inputNovoCliente').value);
    const operadorFiltro = document.getElementById('selectFiltroOperador').value;
    
    grid.innerHTML = "";
    
    for (const id in db) {
        const ent = db[id];
        const nomeParaBusca = normalizarTexto(ent.nome);
        const passaTexto = nomeParaBusca.includes(termo);
        const passaOperador = (operadorFiltro === 'todos') || (ent.operador === operadorFiltro);
        
        const ehPrefeitura = nomeParaBusca.includes('prefeitura');
        const ehCamara = nomeParaBusca.includes('camara'); 
        const passaPoder = (filtroAtivo === 'todos') || 
                           (filtroAtivo === 'prefeitura' && ehPrefeitura) || 
                           (filtroAtivo === 'camara' && ehCamara);

        if (passaTexto && passaPoder && passaOperador) {
            const slug = normalizarTexto(ent.selo);
            grid.innerHTML += `
                <div class="col-md-4">
                    <div class="card shadow-sm border-0 p-3 h-100 dark-card-target">
                        <div class="mb-2">
                            <span class="badge-operador">${ent.operador || 'ASSESI'}</span>
                        </div>
                        <h6 class="fw-bold mb-3">${ent.nome}</h6>
                        <div class="badge w-100 mb-3 p-2 selo-${slug}">${ent.selo} (${ent.perc}%)</div>
                        <div class="d-flex gap-2">
                            <button onclick="abrirChecklist('${id}')" class="btn btn-primary btn-sm flex-grow-1 fw-bold">Avaliar</button>
                            <button onclick="prepararEdicao('${id}')" class="btn btn-outline-secondary btn-sm" title="Editar Nome"><i class="bi bi-pencil"></i></button>
                            <button onclick="confirmarExclusao('${id}')" class="btn btn-outline-danger btn-sm"><i class="bi bi-trash"></i></button>
                        </div>
                    </div>
                </div>`;
        }
    }
    atualizarRodape();
}

function cadastrarEntidade() {
    const input = document.getElementById('inputNovoCliente');
    const nomeOriginal = input.value.trim().toUpperCase();
    const feedback = document.getElementById('feedbackCadastro');
    if (!nomeOriginal) return;

    const jaExiste = Object.values(db).some(ent => normalizarTexto(ent.nome).replace(/\s/g, "") === normalizarTexto(nomeOriginal).replace(/\s/g, ""));
    if (jaExiste) {
        feedback.innerText = "⚠️ Esta entidade já está cadastrada!";
        feedback.style.display = "block";
        setTimeout(() => feedback.style.display = "none", 4000);
        return;
    }

    const id = "ENT_" + Date.now();
    db[id] = { nome: nomeOriginal, operador: "AVULSO", perc: 0, selo: "INEXISTENTE", marcados: {} };
    salvar();
    input.value = "";
    atualizarGridPrincipal();
}

function prepararEdicao(id) {
    idParaEditar = id;
    document.getElementById('inputEditNome').value = db[id].nome;
    new bootstrap.Modal(document.getElementById('modalEditarEntidade')).show();
}

function confirmarEdicao() {
    const novoNome = document.getElementById('inputEditNome').value.trim().toUpperCase();
    if (novoNome && idParaEditar) {
        db[idParaEditar].nome = novoNome;
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

function renderizarGrupos() {
    const container = document.getElementById('containerGrupos');
    container.innerHTML = "";
    const ent = db[entidadeAtiva];

    GRUPOS_CRITERIOS.forEach(grupo => {
        let html = `<div class="grupo-header d-flex justify-content-between mt-4"><span>${grupo.titulo}</span><div class="d-flex"><span class="col-validacao">D</span><span class="col-validacao">A</span><span class="col-validacao">S</span></div></div><ul class="list-group mb-3">`;
        grupo.itens.forEach(item => {
            const st = ent.marcados[item.id] || { g: false, s: false, a: false };
            html += `<li class="list-group-item d-flex align-items-center dark-card-target">
                <div class="flex-grow-1"><small class="text-muted">${item.id}</small> ${item.essencial?'<b class="text-danger">*</b>':''} <br><b>${item.nome}</b></div>
                <div class="d-flex">
                    <input type="checkbox" class="mx-2" ${st.g?'checked':''} onchange="toggleCheck('${item.id}', 'g')">
                    <input type="checkbox" class="mx-2" ${st.s?'checked':''} onchange="toggleCheck('${item.id}', 's')">
                    <input type="checkbox" class="mx-2" ${st.a?'checked':''} onchange="toggleCheck('${item.id}', 'a')">
                </div>
            </li>`;
        });
        container.innerHTML += html + "</ul>";
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

function calcularProgresso() {
    const ent = db[entidadeAtiva];
    let totalItems = 0, atendidos = 0, faltaEssencial = false;

    GRUPOS_CRITERIOS.forEach(g => {
        g.itens.forEach(i => {
            totalItems++;
            const s = ent.marcados[i.id] || {g:false,s:false,a:false};
            if (s.g && s.s && s.a) atendidos++;
            else if (i.essencial) faltaEssencial = true;
        });
    });

    const perc = Math.round((atendidos / totalItems) * 100);
    let selo = perc >= 95 ? (faltaEssencial ? "ELEVADO" : "DIAMANTE") : 
               perc >= 85 ? (faltaEssencial ? "ELEVADO" : "OURO") : 
               perc >= 75 ? (faltaEssencial ? "ELEVADO" : "PRATA") : 
               perc > 0 ? "INICIAL" : "INEXISTENTE";

    ent.perc = perc; ent.selo = selo;
    document.getElementById('progressoTexto').innerText = perc + "%";
    document.getElementById('barraProgresso').style.width = perc + "%";
    const b = document.getElementById('statusSelo');
    b.innerText = selo;
    b.className = `badge p-3 fs-6 rounded-pill selo-${normalizarTexto(selo)}`;
}

function atualizarRodape() {
    const total = Object.keys(db).length;
    const avaliados = Object.values(db).filter(e => e.perc > 0).length;
    document.getElementById('footerStatus').innerHTML = `<span><b>${avaliados}</b> de ${total} entidades</span><span>© 2026 TD2 - Simulador de Transparência Atricon</span>`;
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

function verificarLogin() {
    const senhaDigitada = document.getElementById('senhaLogin').value;
    const erro = document.getElementById('erroLogin');
    
    // Defina sua senha aqui (exemplo: assesi2026)
    if (senhaDigitada === 'assesi2026') {
        const tela = document.getElementById('telaLogin');
        tela.classList.add('hide');
        setTimeout(() => {
            tela.style.display = 'none';
        }, 400);
    } else {
        erro.style.display = 'block';
        document.getElementById('senhaLogin').value = '';
        setTimeout(() => { erro.style.display = 'none'; }, 2000);
    }
}

// Permitir apertar "Enter" para logar
document.addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && document.getElementById('telaLogin').style.display !== 'none') {
        verificarLogin();
    }
});

function logout() {
    const tela = document.getElementById('telaLogin');
    const inputSenha = document.getElementById('senhaLogin');
    
    // Limpa o campo de senha para a próxima tentativa
    inputSenha.value = '';
    
    // Remove a classe hide e volta o display para block
    tela.classList.remove('hide');
    tela.style.display = 'flex';
    
    // Fecha o sidebar automaticamente ao sair
    document.getElementById('sidebar').classList.remove('active');
}