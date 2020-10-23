import client from './client'
import commands from './commands'
import { releaseClaim } from './controllers/claims'

export default () => {
  const pkg = require('../package.json')

  client.once('ready', () => {
    console.info(`Bot started, and initialized. Version ${pkg.version}`)
  })

  client.on('error', (e) => {
    console.error(`${e.name}: ${e.message}`)
  })

  client.on('message', async (message): Promise<any> => {
    const pieces = message.content.split(' ')

    if (pieces.length === 0) {
      return false
    }

    const prefixedCmd = pieces[0].split('+')

    if (prefixedCmd.length !== 2) {
      return false
    }

    const cmd = prefixedCmd[1] as string
    const args = (pieces.length >= 2) ? pieces.slice(1) : []

    if (commands.hasOwnProperty(cmd)) {
      await commands[cmd](message, args)
    }
  })

  client.on('voiceStateUpdate', async (oldState, newState) => {
    const { channel, guild } = oldState

    if (!channel || !channel.name.startsWith('[ECB]') || !guild) {
      return false
    }

    const system = channel.name.slice(6)
    if (channel.members.size === 0) {
      try {
        await releaseClaim(guild.id, system)
        await channel.delete(`Claim and channel for system '${system}' released due to empty voice channel`)
      } catch (e) {
        console.error(`Unable to release claim and delete channel for system '${system}'`, channel.name)
      }
    }

    return true
  })

  client.login(process.env.ECB_BOT_TOKEN)
}
