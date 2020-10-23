import { Message } from 'discord.js'

import { db, serverTimestamp } from '../db'
import { findParentCategory } from '../helpers'
import { CLAIM_STATUS, IClaim } from '../interfaces/claim'
import { IMember } from '../interfaces/member'

const createClaim = async (claimToCreate: IClaim): Promise<string | null> => {
  try {
    return await db
      .collection('claims')
      .add(claimToCreate)
      .then((snap) => snap.id)
  } catch (e) {
    console.error(e)
    throw e
  }
}

const findClaim = async (guildId: string, system: string): Promise<IClaim | null> => {
  try {
    return await db
      .collection('claims')
      .where('guild.id', '==', guildId)
      .where('status', '==', CLAIM_STATUS.ACTIVE)
      .where('system', '==', system)
      .limit(1)
      .get()
      .then((snap) =>
        (snap.empty) ? null : { ...snap.docs[0].data(), id: snap.docs[0].id } as IClaim)
  } catch (e) {
    console.error(e)
    throw e
  }
}

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
    const voiceName = `[ECB] ${system}`
    const voiceChannel = await guild.channels.create(voiceName, {
      parent: category,
      type: 'voice'
    })
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
      updatedAt: (serverTimestamp() as any),
      voiceChannel: { id: voiceChannel.id, name: voiceName }
    })
  } catch (e) {
    await message.reply('Uh oh! There was an error creating your claim')
    return false
  }

  await message.reply(`Got it! ${system} is now yours`)
  return true
}
