require('dotenv').config()
const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  AttachmentBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  PermissionsBitField
} = require('discord.js')
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

  const termosChannel = await client.channels.fetch(process.env.TERMOS_CHANNEL_ID)
  const pagamentosChannel = await client.channels.fetch(process.env.PAYMENTS_CHANNEL_ID)
  const ticketChannel = await client.channels.fetch(process.env.TICKET_CHANNEL_ID)

  const mensagens = await termosChannel.messages.fetch({ limit: 10 })

  if (!mensagens.some(msg => msg.author.id === client.user.id)) {
    const termosRaw = fs.readFileSync('./termos.txt', 'utf8')

    const sections = [
      { title: '📄 Termos de Compra —', content: 'Bem-vindo à Codex Store!' },
      { title: '💾 1. Produtos Digitais', content: 'Todos os produtos comercializados pela Codex Store são digitais e voltados para servidores de FiveM (scripts, sistemas, utilitários, etc). Nenhum produto físico é enviado.' },
      { title: '💳 2. Pagamento', content: 'Aceitamos pagamentos via Pix, cartão de crédito/débito, boleto bancário e outras plataformas disponíveis na loja. O envio do produto só será realizado após a confirmação do pagamento.' },
      { title: '📬 3. Entrega dos Produtos', content: 'A entrega é feita de forma digital, geralmente por e-mail, link de download ou diretamente via contato (ex: Discord). O prazo padrão de entrega é de até 24 horas úteis após a confirmação do pagamento. Em caso de produtos com instalação incluída, o prazo pode variar conforme o agendamento com o cliente.' },
      { title: '♻️ 4. Trocas e Reembolsos', content: 'Por se tratar de produtos digitais, não realizamos reembolsos após o envio do arquivo. Trocas só serão feitas em casos de erro no envio, arquivo corrompido ou incompatibilidade previamente acordada. O cliente é responsável por verificar os requisitos e compatibilidade do script com seu servidor antes da compra.' },
      { title: '🛠️ 5. Suporte Técnico', content: 'Acompanha suporte básico para instalação e ativação do produto adquirido. Suporte personalizado, modificações ou adaptações podem ser cobradas à parte. O suporte é oferecido em horário comercial, salvo acordos previamente definidos.' },
      { title: '🚫 6. Proibição de Redistribuição', content: 'É terminantemente proibida a revenda, redistribuição ou vazamento dos produtos adquiridos. Qualquer tentativa de compartilhamento não autorizado acarretará em banimento da loja, denúncia e medidas legais.' },
      { title: '⚖️ 7. Direitos Autorais', content: 'Todos os produtos são protegidos por direitos autorais. A aquisição de um produto concede licença de uso, mas não transfere a propriedade intelectual do mesmo.' },
      { title: '📩 8. Contato', content: 'Para dúvidas, suporte ou outros assuntos, entre em contato através do ticket.' },
      { title: '✅ Declaração', content: 'Ao finalizar sua compra, você declara que leu, entendeu e concorda com todos os termos acima. **Codex Store — Qualidade, confiança e inovação para seu servidor FiveM!**' }
    ]

    const banner = new AttachmentBuilder('./banner.png')

    const embed = new EmbedBuilder()
      .setColor('#211258')
      .setTitle('Termos de Compra — Codex Store')
      .setFooter({ text: 'Última atualização: 30/07/2025' })
      .setImage('attachment://banner.png')

    for (const section of sections) {
      embed.addFields({
        name: section.title,
        value: section.content.length > 1024 ? section.content.slice(0, 1021) + '...' : section.content
      })
    }

    await termosChannel.send({
      embeds: [embed],
      files: [banner]
    })

    const pagamentoEmbed = new EmbedBuilder()
      .setColor('#5E17EB')
      .setTitle('💰 Meios de Pagamento — Codex Store')
      .setDescription(
        `Confira abaixo os métodos aceitos para pagamento de suas compras:\n\n` +
        `🟢 **Pix:** Pagamento instantâneo com QR Code ou chave.\n` +
        `💳 **Cartão de Crédito/Débito:** Aceitamos diversas bandeiras.\n` +
        `₿ **Bitcoin (BTC):** Para compras com criptomoeda, abra um ticket.`
      )
      .setImage('attachment://banner.png')
      .setFooter({ text: 'Loja oficial Codex Store — Qualidade em primeiro lugar!' })

    await pagamentosChannel.send({
      embeds: [pagamentoEmbed],
      files: [banner]
    })
  }

  // Botão de abrir ticket
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('abrir_ticket')
      .setLabel('🎟️ Abrir Ticket')
      .setStyle(ButtonStyle.Primary)
  )

  await ticketChannel.send({
    content: 'Precisa de ajuda? Clique no botão abaixo para abrir um ticket:',
    components: [row]
  })
})

// Boas-vindas com cargo
client.on('guildMemberAdd', async (member) => {
  const channel = await client.channels.fetch(process.env.WELCOME_CHANNEL_ID)
  await channel.send(`👋 Olá ${member}, seja bem-vindo(a) à **CODEX STORE*! Confira os termos em <#${process.env.TERMOS_CHANNEL_ID}>.`)

  const role = member.guild.roles.cache.get(process.env.ROLE_ID)
  if (role) {
    await member.roles.add(role)
  }
})

// Sistema de Ticket
client.on('interactionCreate', async interaction => {
  if (!interaction.isButton()) return

  if (interaction.customId === 'abrir_ticket') {
    const existing = interaction.guild.channels.cache.find(c =>
      c.name === `ticket-${interaction.user.username.toLowerCase().replace(/[^a-z0-9]/g, '')}`
    )

    if (existing) {
      return interaction.reply({ content: '❗ Você já possui um ticket aberto.', ephemeral: true })
    }

    const ticketChannel = await interaction.guild.channels.create({
      name: `ticket-${interaction.user.username}`,
      type: ChannelType.GuildText,
      permissionOverwrites: [
        {
          id: interaction.guild.roles.everyone,
          deny: [PermissionsBitField.Flags.ViewChannel]
        },
        {
          id: interaction.user.id,
          allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory]
        },
        {
          id: process.env.SUPPORT_ROLE_ID,
          allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory]
        }
      ]
    })

    const closeButton = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('fechar_ticket')
        .setLabel('🔒 Fechar Ticket')
        .setStyle(ButtonStyle.Danger)
    )

    await ticketChannel.send({
      content: `🎟️ Ticket aberto por <@${interaction.user.id}>.\nAguarde atendimento da equipe.`,
      components: [closeButton],
      allowedMentions: { users: [interaction.user.id] }
    })

    await interaction.reply({ content: `✅ Ticket criado: ${ticketChannel}`, ephemeral: true })
  }

  if (interaction.customId === 'fechar_ticket') {
    const logChannel = await client.channels.fetch(process.env.LOG_CHANNEL_ID)

    const embed = new EmbedBuilder()
      .setColor('#ff0000')
      .setTitle('📁 Ticket Fechado')
      .setDescription(`Ticket fechado por <@${interaction.user.id}>.\nCanal: ${interaction.channel.name}`)
      .setTimestamp()

    await logChannel.send({ embeds: [embed] })

    await interaction.channel.send('🔒 Este ticket foi fechado. Canal será deletado em 5 segundos...')
    setTimeout(() => {
      interaction.channel.delete().catch(err => console.error('Erro ao deletar canal:', err))
    }, 5000)
  }
})

client.login(process.env.DISCORD_TOKEN)