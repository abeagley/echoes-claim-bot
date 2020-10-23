import { Message } from 'discord.js'

export const setup = async (message: Message): Promise<void> => {
  console.info('Setup message received', message)
  message.reply(`Go away Mr Programmer, man. I'm not ready`)
}
