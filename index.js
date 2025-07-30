require('dotenv').config()
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js')
const fs = require('fs')

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
})

client.once('ready', async () => {
  console.log(`🤖 Bot está online como ${client.user.tag}`)

  // Envia termos no canal específico (se ainda não enviado)
  const termosChannel = await client.channels.fetch(process.env.TERMOS_CHANNEL_ID)
  const mensagens = await termosChannel.messages.fetch({ limit: 10 })
  if (!mensagens.some(msg => msg.author.id === client.user.id)) {

    // Leia o arquivo de termos e divida em seções (exemplo simples)
    const termosRaw = fs.readFileSync('./termos.txt', 'utf8')

    // Exemplo de divisão simples por linha com título e texto separados
    // Você pode ajustar essa divisão conforme seu arquivo de texto
    // Aqui vou criar manualmente seções exemplo, pois seu texto é grande
    const sections = [
      { title: 'Termos de Compra — ScriptForge Store', content: 'Última atualização: 30/07/2025' },
      { title: '1. Produtos Digitais', content: 'Todos os produtos comercializados pela ScriptForge Store são digitais e voltados para servidores de FiveM (scripts, sistemas, utilitários, etc). Nenhum produto físico é enviado.' },
      { title: '2. Pagamento', content: 'Aceitamos pagamentos via Pix, cartão de crédito/débito, boleto bancário e outras plataformas disponíveis na loja. O envio do produto só será realizado após a confirmação do pagamento.' },
      { title: '3. Entrega dos Produtos', content: 'A entrega é feita de forma digital, geralmente por e-mail, link de download ou diretamente via contato (ex: Discord). O prazo padrão de entrega é de até 24 horas úteis após a confirmação do pagamento. Em caso de produtos com instalação incluída, o prazo pode variar conforme o agendamento com o cliente.' },
      { title: '4. Trocas e Reembolsos', content: 'Por se tratar de produtos digitais, não realizamos reembolsos após o envio do arquivo. Trocas só serão feitas em casos de erro no envio, arquivo corrompido ou incompatibilidade previamente acordada. O cliente é responsável por verificar os requisitos e compatibilidade do script com seu servidor antes da compra.' },
      { title: '5. Suporte Técnico', content: 'Acompanha suporte básico para instalação e ativação do produto adquirido. Suporte personalizado, modificações ou adaptações podem ser cobradas à parte. O suporte é oferecido em horário comercial, salvo acordos previamente definidos.' },
      { title: '6. Proibição de Redistribuição', content: 'É terminantemente proibida a revenda, redistribuição ou vazamento dos produtos adquiridos. Qualquer tentativa de compartilhamento não autorizado acarretará em banimento da loja, denúncia e medidas legais.' },
      { title: '7. Direitos Autorais', content: 'Todos os produtos são protegidos por direitos autorais. A aquisição de um produto concede licença de uso, mas não transfere a propriedade intelectual do mesmo.' },
      { title: '8. Contato', content: 'Para dúvidas, suporte ou outros assuntos, entre em contato através do ticket.' },
      { title: 'Declaração', content: '✅ Ao finalizar sua compra, você declara que leu, entendeu e concorda com todos os termos acima. ScriptForge Store — Qualidade, confiança e inovação para seu servidor FiveM!' }
    ]

    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('Termos de Compra — ScriptForge Store')
      .setFooter({ text: 'Última atualização: 30/07/2025' })

    // Adiciona cada seção como campo, cortando texto se necessário para 1024 caracteres
    for (const section of sections) {
      embed.addFields({
        name: section.title,
        value: section.content.length > 1024 ? section.content.slice(0, 1021) + '...' : section.content
      })
    }

    await termosChannel.send({ embeds: [embed] })

    // Opcional: enviar banner
    await termosChannel.send({ files: ['./banner.png'] })
  }
})

client.on('guildMemberAdd', async (member) => {
  const channel = await client.channels.fetch(process.env.WELCOME_CHANNEL_ID)

  await channel.send(`👋 Olá ${member}, seja bem-vindo(a) à **ScriptForge Store**! Confira os termos em <#${process.env.TERMOS_CHANNEL_ID}>.`)

  const role = member.guild.roles.cache.get(process.env.ROLE_ID)
  if (role) {
    await member.roles.add(role)
  }
})

client.login(process.env.DISCORD_TOKEN)

