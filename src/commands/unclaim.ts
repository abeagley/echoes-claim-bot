import { Message } from 'discord.js'

import { findClaim, releaseClaim } from '../controllers/claims'
import { IClaim } from '../interfaces/claim'

export const unclaim = async (message: Message, args?: string[]): Promise<any> => {
  if (!args || args.length === 0) {
    return false
  }

  const { channel, guild, member } = message
  const system = args[0]

  if (!channel || !guild || !member) {
    return false
  }

  // Check for existing claim
  let existingClaim: IClaim | null = null
  try {
    existingClaim = await findClaim(guild.id, system)
  } catch (e) {
    await message.reply('Uh oh! There was an error trying to find the requested claim')
    return false
  }

  if (!existingClaim) {
    // Reply with an error message
    await message.reply(`That system isn't claimed currently`)
    return false
  }

  try {
    await releaseClaim(
      guild.id,
      system,
      {
        nickname: member.displayName,
        id: member.id,
        highestRole: member.roles.highest.name
      })
  } catch (e) {
    await message.reply('Uh oh! An error occurred when we tried to release this claim')
  }

  try {
    let sysChannel: any = null // TODO: Fix this
    guild.channels.cache.forEach((channel) => {
      if (channel.name === `[ECB] ${system}`) {
        sysChannel = channel
      }
    })

    if (sysChannel) {
      await sysChannel.delete(`[ECB]: System '${system}' was unclaimed.`)
    }
  } catch (e) {
    await message.reply('Uh oh! An error occurred deleting the associated claim voice channel')
  }

  await message.reply(`Claim has been released successfully`)
}
