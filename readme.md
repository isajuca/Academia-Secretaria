# FrontEnd Secretaria - MetaFit Academia

## 📋 Descrição do Projeto

Este é o frontend do painel administrativo da **MetaFit Academia**, um sistema web para gerenciamento de alunos. O projeto permite que administradores façam login e realizem operações CRUD (Criar, Ler, Atualizar, Deletar) nos dados dos alunos, incluindo nome, CPF e status.

O sistema é construído com tecnologias modernas para uma interface responsiva e intuitiva, conectando-se a um backend via API REST.

## 🚀 Funcionalidades

- **Autenticação de Administradores**: Login seguro com token JWT
- **Gerenciamento de Alunos**:
  - Visualizar lista completa de alunos
  - Adicionar novos alunos
  - Editar informações existentes
  - Excluir alunos
- **Interface Responsiva**: Design moderno com Tailwind CSS
- **Dashboard com Estatísticas**: Exibe total de alunos cadastrados

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura da página
- **CSS3**: Estilização com Tailwind CSS
- **JavaScript (ES6+)**: Lógica do frontend e integração com API
- **Tailwind CSS**: Framework CSS para design responsivo
- **Font Awesome**: Ícones para melhor UX
- **Fetch API**: Comunicação com o backend

## 📋 Pré-requisitos

Antes de executar o projeto, certifique-se de ter:

- Um navegador web moderno (Chrome, Firefox, Safari, Edge)
- Conexão com a internet (para carregar bibliotecas externas e conectar ao backend)
- Backend da API rodando (disponível em: https://backup-weld.vercel.app)

## 🔧 Instalação e Execução

### 1. Clonagem do Repositório

```bash
git clone https://github.com/isajuca/Academia-Secretaria.git
cd frontend-secretaria-metafit
```

### 2. Estrutura dos Arquivos

O projeto possui a seguinte estrutura:

```
frontend-secretaria-metafit/
├── index.html          # Página principal
├── script.js           # Lógica JavaScript
├── readme.md           # Este arquivo
└── images/             # Pasta com imagens (logo, etc.)
    └── logoAcademia.png
```

### 4. Configuração da API

O frontend está configurado para se conectar ao backend hospedado no Vercel. Se precisar alterar a URL da API, edite a constante `API_BASE_URL` no arquivo `script.js`:

```javascript
const API_BASE_URL = 'https://backup-weld.vercel.app';
```

## 🌐 Deploy no Vercel

**Link na Vercel**: 'https://academia-secretaria.vercel.app/' 

## 📖 Como Usar

1. **Login**: Use as credenciais de administrador 
2. **Visualizar Alunos**: A lista completa aparece no dashboard
3. **Adicionar Aluno**: Clique em "Novo Aluno" e preencha o formulário
4. **Editar Aluno**: Clique em "Editar" na linha do aluno desejado
5. **Excluir Aluno**: Clique em "Excluir" e confirme a ação
6. **Logout**: Clique no botão "Sair" no canto superior direito

## 👥 Autores

- **SENAI DS 2026** - Isa e Rebeca


---

*Projeto desenvolvido como parte do 1º semestre 2026 - Projeto Academia Interdisciplinar*