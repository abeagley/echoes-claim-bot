import client from './client'
import commands from './commands'

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
    const { channel } = oldState

    if (!channel || !channel.name.startsWith('[ECB]')) {
      return false
    }

    if (channel.members.size === 0) {
      try {
        await channel.delete(`Claim and channel '${channel.name}' released due to empty voice channel`)
      } catch (e) {
        console.error('Unable to delete channel: ', channel.name)
      }
    }

    return true
  })

  client.login(process.env.ECB_BOT_TOKEN)
}
