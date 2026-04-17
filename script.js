// JavaScript

// 🎯 [PASSO 1: Lacuna de Rota Base]
// A URL onde nossa aplicação backend está sendo executada (ex: link da Vercel).
const API_BASE_URL = 'https://backup-weld.vercel.app'; 

// ==========================================
// REFERÊNCIAS DO DOM
// ==========================================
const loginSection = document.getElementById('loginSection');
const adminSection = document.getElementById('adminSection');
const loginForm = document.getElementById('loginForm');
const btnLogout = document.getElementById('btnLogout');
const userInfo = document.getElementById('userInfo');
const loginError = document.getElementById('loginError');

const alunoForm = document.getElementById('alunoForm');
const tabelaAlunos = document.getElementById('tabelaAlunos');
const totalAlunosEl = document.getElementById('totalAlunos');
const btnCancelar = document.getElementById('btnCancelar');
const formTitle = document.getElementById('formTitle');

// ==========================================
// ESTADO DA APLICAÇÃO
// ==========================================
let tokenAtual = localStorage.getItem('adminToken') || null;
let alunos = [];

function iniciarApp() {
    if (tokenAtual) {
        mostrarPainelAdmin();
        carregarAlunos();
    } else {
        mostrarLogin();
    }
}

// ==========================================
// 1. AUTENTICAÇÃO (Login / Logout)
// ==========================================

loginForm.addEventListener('submit', async (e) => {
    // impede o funcionamento padrão de envio do formulário, limpar os campos.
    e.preventDefault(); 
    
    // Capturando os dados digitados
    const usuario = document.getElementById('usuario').value;
    const password = document.getElementById('password').value;

    try {
        // 🎯 [PASSO 2: Lacuna de Rota da API e Dados JSON]
        // Complete com a string do endpoint de login e depois monte o objeto de envio
        // Dica: O backend pede explicitamente as chaves "usuario" e "senha"
        const resposta = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ senha: password, usuario: usuario }) 
        });

        const dados = await resposta.json();
        console.log('Resposta do login:', resposta.status, dados);

        if (resposta.ok && dados.token) {
            tokenAtual = dados.token;
            console.log('Token definido:', tokenAtual);
            localStorage.setItem('adminToken', tokenAtual);
            loginForm.reset();
            mostrarPainelAdmin();
            carregarAlunos();
        } else {
            console.error('Login falhou:', resposta.status, resposta.statusText, dados);
            loginError.classList.remove('hidden');
        }
    } catch (erro) {
        console.error("Erro:", erro);
        alert("Não foi possível conectar.");
    }
});

btnLogout.addEventListener('click', () => {
    tokenAtual = null;
    
    // Tira o token do navegador
    localStorage.removeItem('adminToken');
    mostrarLogin(); 
});


// ==========================================
// 2. CRUD: READ (Carregar lista de alunos)
// ==========================================
async function carregarAlunos() {
    try {
        console.log('Token atual:', tokenAtual);
        const resposta = await fetch(`${API_BASE_URL}/alunos`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${tokenAtual}`
            }
        });

        console.log('Status da resposta:', resposta.status);
        console.log('Headers da resposta:', resposta.headers);

        if (resposta.status === 401 || resposta.status === 403) {
            alert("Sua sessão expirou ou token inválido.");
            btnLogout.click();
            return;
        }

        if (resposta.ok) {
            alunos = await resposta.json();
            console.log('Alunos carregados:', alunos);
            renderizarTabela();
        } else {
            const erroJson = await resposta.text();
            console.error("Falha ao buscar os alunos:", resposta.status, resposta.statusText, erroJson);
        }
    } catch (erro) {
        console.error("Erro:", erro);
    }
}

function formatarDataCadastro(data) {
    if (!data) return '';
    const valor = typeof data === 'string' ? data : data.toString();
    const possivelData = new Date(valor);
    if (Number.isNaN(possivelData.getTime())) return valor;
    return possivelData.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function renderizarTabela() {
    tabelaAlunos.innerHTML = ''; 
    totalAlunosEl.textContent = alunos.length;

    alunos.forEach(aluno => {
        console.log('Renderizando aluno:', aluno);
        console.log('Data de cadastro raw:', aluno.dataCadastro, aluno.data_cadastro, aluno.createdAt, aluno.created_at);
        console.log('id do aluno:', aluno.id || aluno._id);
        console.log('nome do aluno:', aluno.nome);
        console.log('cpf do aluno:', aluno.cpf);
        console.log('status do aluno:', aluno.status);

        const alunoId = aluno.id || aluno._id || '';
        const dataCadastro = aluno.dataCadastro || aluno.data_cadastro || aluno.createdAt || aluno.created_at || '';
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-200 font-medium">${alunoId}</td>
            <td class="px-6 py-4 whitespace-normal text-sm text-slate-200">${aluno.nome}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-300 font-medium">${aluno.cpf}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-300">${aluno.status}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-300">${formatarDataCadastro(dataCadastro)}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button onclick="editarAluno('${alunoId}')" class="text-indigo-600 hover:text-indigo-900 mr-3">Editar</button>
                <button onclick="deletarAluno('${aluno.cpf}')" class="text-red-600 hover:text-red-900">Excluir</button>
            </td>
        `;
        tabelaAlunos.appendChild(tr);
    });
}

// ==========================================
// 3. CRUD: CREATE e UPDATE
// ==========================================
alunoForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('alunoId').value;
    const nome = document.getElementById('nome').value;
    const cpf = document.getElementById('cpf').value;
    const status = document.getElementById('status').value;

    // Validação: CPF deve ter exatamente 11 números
    const cpfApenasNumeros = cpf.replace(/\D/g, '');
    if (cpfApenasNumeros.length !== 11) {
        alert('Erro: O CPF deve ter exatamente 11 números (sem pontos ou hífen).');
        return;
    }

    const alunoData = { nome: nome, cpf: cpf, status: status };
    console.log('Dados do aluno a enviar:', alunoData);

    try {
        let url = `${API_BASE_URL}/alunos`;
        let metodoHTTP = 'POST';

        if (id) {
            url = `${API_BASE_URL}/alunos/${cpf}`;
            console.log('ID presente, atualizando aluno com CPF:', id, 'URL de destino:', url);
            metodoHTTP = 'PUT';
        }

        console.log('URL:', url, 'Método:', metodoHTTP, 'Token:', tokenAtual);

        const respostaApi = await fetch(url, {
            method: metodoHTTP,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${tokenAtual}`
            },
            body: JSON.stringify(alunoData)
        });

        console.log('Status da resposta API:', respostaApi.status);
        console.log('Headers da resposta API:', respostaApi.headers);

        if (respostaApi.status === 401 || respostaApi.status === 403) {
            alert("Sua sessão expirou ou token inválido.");
            btnLogout.click();
            return;
        }

        if (respostaApi.ok) {
            const dadosResposta = await respostaApi.json();
            console.log('Resposta de sucesso:', dadosResposta);
            alert(id ? "Aluno atualizado!" : "Aluno criado com sucesso!");
            limparFormulario();
            carregarAlunos();
        } else {
            const erroJson = await respostaApi.text();
            console.error("Erro ao salvar aluno:", respostaApi.status, respostaApi.statusText, erroJson);
            alert("Falha ao salvar o aluno. Status: " + respostaApi.status + ". Detalhes: " + erroJson);
        }
    } catch (erro) {
        console.error("Erro:", erro);
    }
});

function editarAluno(id) {
    const aluno = alunos.find(c => String(c.id || c._id) === String(id));
    console.log('Aluno encontrado para edição:', aluno);
    
    if (aluno) {
        const alunoId = aluno.id || aluno._id || '';
        document.getElementById('alunoId').value = alunoId;
        document.getElementById('nome').value = aluno.nome;
        document.getElementById('cpf').value = aluno.cpf;
        document.getElementById('status').value = aluno.status;

        formTitle.textContent = "Editar Aluno";
        btnCancelar.classList.remove('hidden');
    }
}

btnCancelar.addEventListener('click', limparFormulario);

function limparFormulario() {
    alunoForm.reset(); // Use alunoForm aqui
    document.getElementById('alunoId').value = '';
    formTitle.textContent = "Novo Aluno";
    btnCancelar.classList.add('hidden');
}


// ==========================================
// 4. CRUD: DELETE
// ==========================================
async function deletarAluno(cpf) {
    if (!confirm("Tem certeza que deseja excluir este aluno?")) return;

    try {
        const resposta = await fetch(`${API_BASE_URL}/alunos/${cpf}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${tokenAtual}`
            }
        });

        if (resposta.status === 401 || resposta.status === 403) {
            alert("Sua sessão expirou ou token inválido.");
            btnLogout.click();
            return;
        }

        if (resposta.ok) {
            carregarAlunos(); 
        } else {
            const erroJson = await resposta.text();
            console.error("Erro ao excluir aluno:", resposta.status, resposta.statusText, erroJson);
            alert("Falha ao excluir o aluno. Status: " + resposta.status);
        }
    } catch (erro) {
        console.error("Erro ao excluir:", erro);
    }
}


// ==========================================
// CONTROLE DE TELA
// ==========================================
function mostrarLogin() {
    loginSection.classList.remove('hidden');
    adminSection.classList.add('hidden');
    userInfo.classList.add('hidden');
    loginError.classList.add('hidden');
}

function mostrarPainelAdmin() {
    loginSection.classList.add('hidden');
    adminSection.classList.remove('hidden');
    userInfo.classList.remove('hidden');
}

iniciarApp();
