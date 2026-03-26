const listaCriteriosAtricon = [
    { id: 1, desc: "Informações Institucionais (Estrutura e Contatos)", essencial: true },
    { id: 2, desc: "Ferramenta de Pesquisa e Acessibilidade", essencial: true },
    { id: 3, desc: "Perguntas Frequentes (FAQ)", essencial: false },
    { id: 4, desc: "Receitas: Previsão e Arrecadação", essencial: true },
    { id: 5, desc: "Despesas: Empenho, Liquidação e Pagamento", essencial: true },
    { id: 6, desc: "Transferências Voluntárias e Repasses", essencial: false },
    { id: 7, desc: "Licitações: Editais, Anexos e Resultados", essencial: true },
    { id: 8, desc: "Contratos: Íntegra e Aditivos", essencial: true },
    { id: 9, desc: "Sanções Administrativas Aplicadas", essencial: false },
    { id: 10, desc: "Folha de Pagamento Nominal e Salários", essencial: true },
    { id: 11, desc: "Diárias e Passagens (Valor/Motivo/Beneficiário)", essencial: true },
    { id: 12, desc: "Concursos Públicos e Seleções", essencial: false },
    { id: 13, desc: "Instrumentos de Planejamento (PPA, LDO e LOA)", essencial: true },
    { id: 14, desc: "Relatórios Fiscais (RREO e RGF)", essencial: true },
    { id: 15, desc: "Parecer Prévio das Contas Anuais", essencial: true },
    { id: 16, desc: "Serviço de Informação ao Cidadão (e-SIC)", essencial: true },
    { id: 17, desc: "Relatório Estatístico do SIC", essencial: true },
    { id: 18, desc: "Ouvidoria (Canais de Denúncia/Sugestão)", essencial: true },
    { id: 19, desc: "Obras Públicas (Relatórios e Medições)", essencial: false },
    { id: 20, desc: "Saúde e Educação (Escalas/Vagas/Listas)", essencial: false },
    { id: 21, desc: "LGPD: Encarregado e Políticas de Privacidade", essencial: false },
    { id: 22, desc: "Dados Abertos (Formatos CSV, XML, XLS)", essencial: false }
];

let clientesDB = JSON.parse(localStorage.getItem('assesi_clientes_v2026')) || {};
let clienteAtivoID = null;

function cadastrarCliente() {
    const nome = document.getElementById('inputNovoCliente').value.trim();
    if (!nome) return;
    if (clientesDB[nome]) return alert("Esta entidade já foi cadastrada.");
    
    clientesDB[nome] = { nome: nome, itensMarcados: [], porcentagem: 0, selo: "Inexistente" };
    document.getElementById('inputNovoCliente').value = '';
    salvarESincronizar();
}

function renderizarLista() {
    const grid = document.getElementById('gridClientes');
    grid.innerHTML = '';
    Object.keys(clientesDB).forEach(id => {
        const c = clientesDB[id];
        const div = document.createElement('div');
        div.className = 'col-md-4 mb-4';
        div.innerHTML = `
            <div class="card h-100 shadow-sm card-cliente">
                <div class="card-body d-flex flex-column text-center">
                    <h5 class="fw-bold text-dark mb-3">${c.nome}</h5>
                    <div class="mb-3">
                        <span class="badge ${getClasseSelo(c.selo)} p-2 w-100 fs-6">${c.selo}</span>
                    </div>
                    <p class="text-muted small">Índice Atual: <strong>${c.porcentagem}%</strong></p>
                    <div class="mt-auto pt-3">
                        <button class="btn btn-primary w-100 mb-2" onclick="abrirAvaliacao('${id}')">Avaliar</button>
                        <button class="btn btn-link btn-sm text-danger" onclick="excluirCliente(event, '${id}')">Excluir</button>
                    </div>
                </div>
            </div>
        `;
        grid.appendChild(div);
    });
}

function abrirAvaliacao(id) {
    clienteAtivoID = id;
    document.getElementById('telaLista').classList.add('d-none');
    document.getElementById('telaAvaliacao').classList.remove('d-none');
    document.getElementById('nomeEntidadeTitulo').innerText = clientesDB[id].nome;
    renderizarChecklist();
    window.scrollTo(0,0);
}

function voltarParaLista() {
    clienteAtivoID = null;
    document.getElementById('telaAvaliacao').classList.add('d-none');
    document.getElementById('telaLista').classList.remove('d-none');
    renderizarLista();
}

function renderizarChecklist() {
    const container = document.getElementById('containerCriterios');
    container.innerHTML = '';
    const marcados = clientesDB[clienteAtivoID].itensMarcados;

    listaCriteriosAtricon.forEach(item => {
        const li = document.createElement('li');
        li.className = `list-group-item d-flex justify-content-between align-items-center ${item.essencial ? 'essencial-item' : ''}`;
        const isChecked = marcados.includes(item.id) ? 'checked' : '';
        li.innerHTML = `
            <div>
                <input class="form-check-input me-3" type="checkbox" ${isChecked} onchange="toggleCrit(${item.id})">
                <span class="${item.essencial ? 'fw-bold' : ''}">${item.desc}</span>
            </div>
            ${item.essencial ? '<span class="badge bg-danger rounded-pill">*</span>' : ''}
        `;
        container.appendChild(li);
    });
    calcular();
}

function toggleCrit(id) {
    let marcados = clientesDB[clienteAtivoID].itensMarcados;
    marcados.includes(id) ? marcados = marcados.filter(v => v !== id) : marcados.push(id);
    clientesDB[clienteAtivoID].itensMarcados = marcados;
    salvarESincronizar();
    calcular();
}

function calcular() {
    const cliente = clientesDB[clienteAtivoID];
    const marcados = cliente.itensMarcados;
    const porcentagem = Math.round((marcados.length / listaCriteriosAtricon.length) * 100);
    
    const essenciaisIDs = listaCriteriosAtricon.filter(i => i.essencial).map(i => i.id);
    const todosEssenciaisOk = essenciaisIDs.every(id => marcados.includes(id));

    let selo = "";
    let infoHTML = "";

    // Lógica de Selos 2026
    if (todosEssenciaisOk) {
        if (porcentagem >= 95) selo = "Diamante";
        else if (porcentagem >= 85) selo = "Ouro";
        else if (porcentagem >= 75) selo = "Prata";
    }

    if (selo === "") {
        if (porcentagem >= 50) selo = "Intermediário";
        else if (porcentagem >= 30) selo = "Básico";
        else if (porcentagem > 0) selo = "Inicial";
        else selo = "Inexistente";
    }

    // Mensagem de Status
    if (!todosEssenciaisOk && porcentagem >= 75) {
        infoHTML = "<div class='bg-warning p-2 text-dark mt-2 fw-bold'>Faltam itens essenciais para Selo.</div>";
    } else if (todosEssenciaisOk && porcentagem >= 75) {
        infoHTML = "<div class='bg-success text-white p-2 mt-2 fw-bold'>Apto para Selo de Qualidade!</div>";
    } else {
        infoHTML = "<div class='text-muted mt-2'>Verificando conformidade...</div>";
    }

    cliente.porcentagem = porcentagem;
    cliente.selo = selo;

    document.getElementById('textoPorcentagem').innerText = porcentagem + "%";
    document.getElementById('barraProgresso').style.width = porcentagem + "%";
    
    const badge = document.getElementById('badgeSeloFinal');
    badge.innerText = selo.toUpperCase();
    badge.className = "badge p-3 fs-6 " + getClasseSelo(selo);
    
    document.getElementById('infoEssenciais').innerHTML = infoHTML;
}

function getClasseSelo(selo) {
    const classes = { 
        'Diamante': 'selo-diamante', 'Ouro': 'selo-ouro', 'Prata': 'selo-prata', 
        'Intermediário': 'status-intermediario', 'Básico': 'status-basico', 
        'Inicial': 'status-inicial', 'Inexistente': 'status-inexistente' 
    };
    return classes[selo] || 'bg-secondary';
}

function salvarESincronizar() {
    localStorage.setItem('assesi_clientes_v2026', JSON.stringify(clientesDB));
}

function excluirCliente(e, id) {
    e.stopPropagation();
    if (confirm(`Excluir permanentemente ${id}?`)) {
        delete clientesDB[id];
        salvarESincronizar();
        renderizarLista();
    }
}

function exportarBackup() {
    const blob = new Blob([JSON.stringify(clientesDB, null, 2)], {type: 'application/json'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `backup_atricon_assesi.json`;
    a.click();
}

function importarBackup(e) {
    const reader = new FileReader();
    reader.onload = (ev) => {
        try {
            clientesDB = JSON.parse(ev.target.result);
            salvarESincronizar();
            renderizarLista();
            alert("Backup carregado!");
        } catch(err) { alert("Erro ao importar."); }
    };
    reader.readAsText(e.target.files[0]);
}

renderizarLista();