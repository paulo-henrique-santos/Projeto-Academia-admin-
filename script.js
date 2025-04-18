const ENDPOINT_ALUNOS = 'https://neo-gym-backend.vercel.app/academia'
const ENDPOINT_LISTA_TODAS = "http://127.0.0.1:5000/academia/lista"

// Formulário da criação
let criarFormulario = document.getElementById('novoFormulario')
let inputNovoNome = document.getElementById('novoNome')
let inputNovoCpf = document.getElementById('novoCpf')

// Formulário da Edição
let formularioAtualizacao = document.getElementById('atualizarFormulario')
let inputAtualizarId = document.getElementById('atualizarId')
let inputAtualizarNome = document.getElementById('atualizarNome')
let inputAtualizarCpf = document.getElementById('atualizarCpf')
let botaoCancelarAtualizacao = document.getElementById('cancelarAtualizacao')

// Lista onde os alunos serão exibidos
let listaAlunos = document.getElementById('listaAlunos')

// ===============================
// FUNÇÕES PARA INTERAGIR COM API 
// ===============================

// Listar as alunos no elemento lista

async function buscarListarAlunos() {
    console.log("Buscando alunos na API....")
    listaAlunos.innerHTML = '<p>Carregando alunos...</p>'

    try {
        const respostaHttp = await fetch(ENDPOINT_LISTA_TODAS)

        if(!respostaHttp){
            throw new Error(`Erro na API: ${respostaHttp.status} ${respostaHttp.statusText}`)
        }

        const alunos = await respostaHttp.json()

        console.log("Alunos recebidos: ",alunos)
        
        exibirAlunosNaTela(alunos)

    } catch (erro) {
        console.error(`Falha ao buscar alunos: ${erro}`)
        listaAlunos.innerHTML = `
        <p style="color: red">Erro ao carregar alunos: ${erro.message}</p>`
    }
}

// Criar um novo aluno
async function criarAluno(evento) {
    evento.preventDefault() // Previne o comportamento padrão do formulário (que é recarregar a página)
    console.log("Tentando criar novo aluno...")

    const nome = inputNovoNome.value
    const cpf = inputNovoCpf.value

    if (!nome || !cpf) {
        alert("Por favor, preencha o nome e cpf.")
        return
    }

    const novoAluno = {
        nome: nome,
        cpf: cpf
    }

    try {
        const respostaHttp = await fetch(ENDPOINT_ALUNOS, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(novoAluno)
        })

        const resultadoApi = await respostaHttp.json()

        if (!respostaHttp.ok) {
            throw new Error(resultadoApi.mensagem || `Erro ao criar aluno: ${respostaHttp.status}`)
        }

        console.log("Aluno criado com sucesso!", resultadoApi)
        alert(resultadoApi.mensagem)

        inputNovoNome.value = ''
        inputNovoCpf.value = ''

        await buscarListarAlunos()

    } catch (erro) {
        console.error("Falha ao criar aluno:", erro)
        alert(`Erro ao criar aluno: ${erro.message}`)
    }
}

// Atualizar um aluno existente
async function atualizarAluno(evento) {
    evento.preventDefault()
    console.log("Tentando atualizar aluno...")

    const id = inputAtualizarId.value
    const nome = inputAtualizarNome.value
    const cpf = inputAtualizarCpf.value

    const dadosAlunoAtualizada = {
        nome: nome,
        cpf: cpf
    }

    if (!id) {
        console.error("ID do aluno para atualização não encontrado!")
        alert("Erro interno: ID do aluno não encontrado para atualizar.")
        return
    }

    if (!nome || !cpf) {
        alert("Por favor, preencha o nome e o cpf para atualizar.")
        return
    }

    try {
        const respostaHttp = await fetch(`${ENDPOINT_ALUNOS}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dadosAlunoAtualizada)
        })

        const resultadoApi = await respostaHttp.json()

        if (!respostaHttp.ok) {
            throw new Error(resultadoApi.mensagem || `Erro ao atualizar aluno: ${respostaHttp.status}`)
        }

        console.log("Aluno atualizado com sucesso! ID:", id)
        alert(resultadoApi.mensagem)

        esconderFormularioAtualizacao()
        await buscarListarAlunos()

    } catch (erro) {
        console.error("Falha ao atualizar aluno:", erro)
        alert(`Erro ao atualizar aluno: ${erro.message}`)
    }
}

// Excluir uma aluno
async function excluirAluno(id) {
    console.log(`Tentando excluir aluno com ID: ${id}`)

    if (!confirm(`Tem certeza que deseja excluir a aluno com ID ${id}? Esta ação não pode ser desfeita.`)) {
        console.log("Exclusão cancelada pelo usuário.")
        return
    }

    try {
        const respostaHttp = await fetch(`${ENDPOINT_ALUNOS}/${id}`, {
            method: 'DELETE'
        })

        const resultadoApi = await respostaHttp.json()

        if (!respostaHttp.ok) {
            throw new Error(resultadoApi.mensagem || `Erro ao excluir aluno: ${respostaHttp.status}`)
        }

        console.log("Aluno excluído com sucesso!", id)
        alert(resultadoApi.mensagem)

        await buscarListarAlunos()

    } catch (erro) {
        console.error("Falha ao excluir aluno:", erro)
        alert(`Erro ao excluir aluno: ${erro.message}`)
    }
}

// ===============================
// FUNÇÕES PARA ATUALIZAR A PÁGINA
// ===============================

// --- Mostrar as alunos na lista ---
function exibirAlunosNaTela(alunos) {
    console.log("Atualizando a lista de alunos na tela...")
    listaAlunos.innerHTML = ''

    if (!alunos || alunos.length === 0) {
        listaAlunos.innerHTML = '<p>Nenhum aluno cadastrado ainda.</p>'
        return
    }

    for (const aluno of alunos) {
        const elementoAlunoDiv = document.createElement('div')
        elementoAlunoDiv.classList.add('border', 'border-gray-300', 'p-2', 'mb-3', 'rounded', 'flex', 'justify-between', 'items-center')
        elementoAlunoDiv.id = `aluno-${aluno.id}`
    
        elementoAlunoDiv.innerHTML = `
            <div class="flex-grow mr-3">
                <strong>${aluno.nome}</strong>
                <p><small>Resposta: ${aluno.cpf || 'Não definida'}</small></p>
                <p><small>Status: ${aluno.status}</small></p>
                <p><small>Id: ${aluno.id}</small></p>
            </div>
            <div>
                <button class="edit-btn bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-1 px-2 rounded text-sm ml-1">Editar</button>
                <button class="delete-btn bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded text-sm ml-1">Excluir</button>
            </div>
        `
    
        const botaoEditar = elementoAlunoDiv.querySelector('.edit-btn')
        botaoEditar.addEventListener('click', function() {
            console.log(`Botão Editar clicado para o aluno ID: ${aluno.id}`)
            exibirFormularioAtualizacao(aluno.id, aluno.pergunta, aluno.resposta)
        })
    
        const botaoExcluir = elementoAlunoDiv.querySelector('.delete-btn')
        botaoExcluir.addEventListener('click', function() {
            console.log(`Botão Excluir clicado para a aluno ID: ${aluno.id}`)
            excluiraluno(aluno.id)
        })
    
        listaAlunos.appendChild(elementoAlunoDiv)
    }
}

// Mostrar o formulário de atualização
function exibirFormularioAtualizacao(id, nome, cpf) {
    console.log("Mostrando formulário de atualização para a aluno ID:", id)
    inputAtualizarId.value = id
    inputAtualizarNome.value = nome
    inputAtualizarCpf.value = cpf

    formularioAtualizacao.classList.remove('hidden')
    formularioCriacao.classList.add('hidden')

    formularioAtualizacao.scrollIntoView({ behavior: 'smooth' })
}

// Esconder o formulário de atualização
function esconderFormularioAtualizacao() {
    console.log("Escondendo formulário de atualização.")
    formularioAtualizacao.classList.add('hidden')
    formularioCriacao.classList.remove('hidden')

    inputAtualizarId.value = ''
    inputAtualizarNome.value = ''
    inputAtualizarCpf.value = ''
}


// ==============================================================
// EVENT LISTENERS GLOBAIS (Campainhas principais da página)
// ==============================================================

formularioCriacao.addEventListener('submit',criarAluno)
formularioAtualizacao.addEventListener('submit', atualizarAluno)
botaoCancelarAtualizacao.addEventListener('click', esconderFormularioAtualizacao)

// INICIALIZAÇÃO DA PÁGINA

document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM completamente carregado. Iniciando busca de alunos...")
    buscarListarAlunos()
})