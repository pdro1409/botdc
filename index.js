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
    const termos = fs.readFileSync('./termos.txt', 'utf8')
    await termosChannel.send(termos)
    await termosChannel.send({ files: ['./banner.png'] }) // opcional
  }
})

// Quando novo membro entra
client.on('guildMemberAdd', async (member) => {
  const channel = await client.channels.fetch(process.env.WELCOME_CHANNEL_ID)

  await channel.send(`👋 Olá ${member}, seja bem-vindo(a) à **Telles Store**! Confira os termos em <#${process.env.TERMOS_CHANNEL_ID}>.`)

  // Adiciona cargo automaticamente
  const role = member.guild.roles.cache.get(process.env.ROLE_ID)
  if (role) {
    await member.roles.add(role)
  }
})

client.login(process.env.DISCORD_TOKEN)
