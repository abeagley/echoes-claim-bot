import { Message } from 'discord.js'

import { createClaim, findClaim } from '../controllers/claims'
import { serverTimestamp } from '../db'
import { findParentCategory } from '../helpers'
import { CLAIM_STATUS } from '../interfaces/claim'
import { IMember } from '../interfaces/member'

export const claim = async (message: Message, args?: string[]): Promise<any> => {
  if (!args || args.length === 0) {
    return false
  }

  const { channel, guild, member } = message
  const system = args[0]

  if (!channel || !guild || !member) {
    return false
  }

  const category = findParentCategory(channel)

  // Check for existing claim
  try {
    const existingClaim = await findClaim(guild.id, system)
    if (existingClaim) {
      // Reply with an error message
      return message.reply(`That system already has an active claim.`)
    }
  } catch (e) {
    await message.reply('Uh oh! There was an error verifying claim availability')
    return false
  }

  // Create the new claim along with voice channel
  try {
    const createdBy: IMember = {
      highestRole: member.roles.highest.name,
      id: member.id,
      nickname: member.displayName
    }

    await createClaim({
      createdAt: (serverTimestamp() as any),
      createdBy,
      guild: {
        id: guild.id,
        name: guild.name
      },
      party: [createdBy],
      status: CLAIM_STATUS.ACTIVE,
      system: system,
      unclaimedBy: null,
      updatedAt: (serverTimestamp() as any)
    })

    // Create the voice channel for this claim
    await guild.channels.create(`[ECB] ${system}`, {
      parent: category,
      type: 'voice'
    })
  } catch (e) {
    await message.reply('Uh oh! There was an error creating your claim')
    return false
  }

  await message.reply(`Got it! ${system} is now yours`)
  return true
}
