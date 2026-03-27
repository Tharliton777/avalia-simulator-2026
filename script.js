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

// Variáveis de Estado
let db = JSON.parse(localStorage.getItem('assesi_atricon_v2026')) || {};
let entidadeAtiva = null;
let idParaExcluir = null;
let idParaEditar = null;

window.onload = () => {
    atualizarGridPrincipal();
    
    // Sidebar toggle
    const btnSidebar = document.getElementById('sidebarCollapse');
    if(btnSidebar) btnSidebar.onclick = () => document.getElementById('sidebar').classList.toggle('active');

    // Dark Mode
    const toggleDark = document.getElementById('darkModeToggle');
    if(toggleDark) {
        toggleDark.onchange = (e) => {
            document.documentElement.setAttribute('data-bs-theme', e.target.checked ? 'dark' : 'light');
        };
    }
    
    // Configuração do botão de exclusão
    const btnConfirmExcluir = document.getElementById('btnConfirmarExclusao');
    if(btnConfirmExcluir) {
        btnConfirmExcluir.onclick = () => {
            if (idParaExcluir && db[idParaExcluir]) {
                delete db[idParaExcluir];
                salvar();
                atualizarGridPrincipal();
                const modalExcluir = bootstrap.Modal.getInstance(document.getElementById('modalExcluir'));
                if(modalExcluir) modalExcluir.hide();
                idParaExcluir = null;
            }
        };
    }
};

function cadastrarEntidade() {
    const input = document.getElementById('inputNovoCliente');
    if (!input || !input.value.trim()) return;
    const id = Date.now().toString();
    db[id] = { nome: input.value.trim(), perc: 0, selo: "INEXISTENTE", marcados: {} };
    input.value = "";
    salvar(); 
    atualizarGridPrincipal();
}

function atualizarGridPrincipal() {
    const grid = document.getElementById('gridClientes'); 
    if(!grid) return;
    grid.innerHTML = "";
    
    for (const id in db) {
        const ent = db[id];
        const slug = ent.selo.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        grid.innerHTML += `
            <div class="col-md-4">
                <div class="card shadow-sm border-0 p-3 dark-card-target h-100">
                    <h5 class="fw-bold mb-2 text-truncate">${ent.nome}</h5>
                    <div class="badge w-100 mb-3 p-2 selo-${slug}">${ent.selo} (${ent.perc}%)</div>
                    <div class="d-flex gap-2">
                        <button onclick="abrirChecklist('${id}')" class="btn btn-primary btn-sm flex-grow-1">Avaliar</button>
                        <button onclick="editarEntidade('${id}')" class="btn btn-outline-secondary btn-sm" title="Editar"><i class="bi bi-pencil"></i></button>
                        <button onclick="excluirEntidade('${id}')" class="btn btn-outline-danger btn-sm" title="Excluir"><i class="bi bi-trash"></i></button>
                    </div>
                </div>
            </div>`;
    }
}

// Função de Editar Entidade
function editarEntidade(id) {
    if (!db[id]) return;
    idParaEditar = id;
    document.getElementById('inputEditarNome').value = db[id].nome;
    
    // Inicia o Modal do Bootstrap corretamente
    const modalEl = document.getElementById('modalEditar');
    const modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);
    modalInstance.show();
}

// Função de Confirmar Edição
function confirmarEdicao() {
    const input = document.getElementById('inputEditarNome');
    const novoNome = input.value.trim();
    
    if (idParaEditar && novoNome !== "") {
        db[idParaEditar].nome = novoNome;
        salvar();
        atualizarGridPrincipal();
        
        // Se a tela de avaliação estiver aberta para essa entidade, atualiza o nome no topo
        if (entidadeAtiva === idParaEditar) {
            const tituloTopo = document.getElementById('nomeEntidadeAtiva');
            if(tituloTopo) tituloTopo.innerText = novoNome;
        }

        // Fecha o modal
        const modalEl = document.getElementById('modalEditar');
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        if(modalInstance) modalInstance.hide();
        
        idParaEditar = null;
    }
}

function abrirChecklist(id) {
    if(!db[id]) return;
    entidadeAtiva = id;
    document.getElementById('telalista').classList.add('d-none');
    document.getElementById('telaAvaliacao').classList.remove('d-none');
    document.getElementById('nomeEntidadeAtiva').innerText = db[id].nome;
    renderizarGrupos();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderizarGrupos() {
    const container = document.getElementById('containerGrupos'); 
    if(!container || !entidadeAtiva) return;
    container.innerHTML = "";
    const ent = db[entidadeAtiva];

    GRUPOS_CRITERIOS.forEach(grupo => {
        let html = `
            <div class="grupo-header d-flex justify-content-between align-items-center mb-0 mt-4">
                <span class="fw-bold">${grupo.titulo}</span>
                <div class="d-flex" style="width: 120px;">
                    <span class="col-validacao">G</span>
                    <span class="col-validacao">S</span>
                    <span class="col-validacao">A</span>
                </div>
            </div>
            <ul class="list-group mb-2 shadow-sm">`;
        
        grupo.itens.forEach(item => {
            const st = ent.marcados[item.id] || { g: false, s: false, a: false };
            html += `
                <li class="list-group-item d-flex align-items-center py-3">
                    <div class="flex-grow-1">
                        <small class="text-muted d-block">#${item.id} ${item.essencial ? '<span class="text-danger fw-bold">*</span>' : ''}</small>
                        <span class="fw-medium">${item.nome}</span>
                    </div>
                    <div class="d-flex" style="width: 120px;">
                        <div class="col-validacao"><input type="checkbox" class="form-check-input" ${st.g?'checked':''} onchange="toggleCheck('${item.id}', 'g')"></div>
                        <div class="col-validacao"><input type="checkbox" class="form-check-input" ${st.s?'checked':''} onchange="toggleCheck('${item.id}', 's')"></div>
                        <div class="col-validacao"><input type="checkbox" class="form-check-input" ${st.a?'checked':''} onchange="toggleCheck('${item.id}', 'a')"></div>
                    </div>
                </li>`;
        });
        container.innerHTML += html + `</ul>`;
    });
    calcularProgresso();
}

function toggleCheck(id, tipo) {
    if(!entidadeAtiva) return;
    const ent = db[entidadeAtiva];
    if (!ent.marcados[id]) ent.marcados[id] = { g: false, s: false, a: false };
    ent.marcados[id][tipo] = !ent.marcados[id][tipo];
    salvar(); 
    calcularProgresso();
}

function calcularProgresso() {
    const ent = db[entidadeAtiva];
    let total = 0, ok = 0, faltaEssencial = false;

    GRUPOS_CRITERIOS.forEach(g => g.itens.forEach(i => {
        total++;
        const st = ent.marcados[i.id] || { g: false, s: false, a: false };
        if (st.g && st.s && st.a) {
            ok++;
        } else if (i.essencial) {
            faltaEssencial = true;
        }
    }));

    const perc = Math.round((ok / total) * 100) || 0;
    let selo = "INEXISTENTE";
    
    if (perc >= 95) selo = faltaEssencial ? "ELEVADO" : "DIAMANTE";
    else if (perc >= 85) selo = faltaEssencial ? "ELEVADO" : "OURO";
    else if (perc >= 75) selo = faltaEssencial ? "ELEVADO" : "PRATA";
    else if (perc >= 50) selo = "INTERMEDIARIO";
    else if (perc >= 30) selo = "BASICO";
    else if (perc > 0) selo = "INICIAL";

    ent.perc = perc; 
    ent.selo = selo;
    
    document.getElementById('progressoTexto').innerText = perc + "%";
    document.getElementById('barraProgresso').style.width = perc + "%";
    
    const b = document.getElementById('statusSelo');
    const slug = selo.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    b.innerText = selo; 
    b.className = `badge p-3 fs-6 rounded-pill shadow-sm selo-${slug}`;
}

function voltarParaInicio() { 
    entidadeAtiva = null; 
    document.getElementById('telaAvaliacao').classList.add('d-none'); 
    document.getElementById('telalista').classList.remove('d-none'); 
    document.getElementById('sidebar').classList.add('active');
    atualizarGridPrincipal(); 
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function excluirEntidade(id) {
    idParaExcluir = id;
    const modalEl = document.getElementById('modalExcluir');
    const instance = bootstrap.Modal.getOrCreateInstance(modalEl);
    instance.show();
}

function salvar() { 
    localStorage.setItem('assesi_atricon_v2026', JSON.stringify(db)); 
}

function exportarDados() { 
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(db)); 
    const dlAnchor = document.createElement('a'); 
    dlAnchor.setAttribute("href", dataStr); 
    dlAnchor.setAttribute("download", "backup_assesi_2026.json"); 
    dlAnchor.click(); 
}