# 🤖 Discord Bot - Telles Store

Este projeto é um **bot para Discord** desenvolvido para a **Telles Store**, com funcionalidades voltadas para **boas-vindas de usuários, exibição de termos de compra**, sistema de **tickets de suporte**, e **automação de permissões**.

## 🚀 Funcionalidades

- 👋 Envia mensagem de boas-vindas ao novo membro.
- 📜 Exibe os **termos de compra** em um canal específico.
- 🛠️ Cria tickets de suporte com botão e canal privado.
- 🧾 Fecha tickets e registra logs de atendimento.
- 🔖 Atribui cargo automaticamente ao novo usuário.

## 📁 Estrutura do Projeto

```
botdc/
│
├── index.js           # Arquivo principal do bot
├── .env               # Variáveis de ambiente (TOKEN)
├── package.json       # Dependências e scripts
└── README.md          # Este arquivo
```

## ⚙️ Tecnologias

- [Node.js](https://nodejs.org/)
- [Discord.js v14](https://discord.js.org/)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [fs](https://nodejs.org/api/fs.html)

## 📦 Instalação

```bash
git clone https://github.com/pdro1409/botdc.git
cd botdc
npm install
```

## 🔐 Configuração

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```
TOKEN=seu_token_do_bot_aqui
```

Edite também os IDs de canais e cargos diretamente no `index.js` conforme a estrutura do seu servidor.

## ▶️ Executando o Bot

```bash
node index.js
```

## 🛟 Contribuição

Contribuições são bem-vindas! Sinta-se livre para abrir **issues** ou enviar **pull requests**.

## 📄 Licença

Este projeto está sob a licença **MIT**.

---

Feito com 💜 por [Pedro Augusto](https://github.com/pdro1409)