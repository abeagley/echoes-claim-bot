import { Message } from 'discord.js'
import { IClaim } from '../interfaces/claim'
import { db } from '../db'

const updateClaim = async (claimToCreate: IClaim): Promise<string | null> => {
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

export const unclaim = async (message: Message): Promise<void> => {
  console.info('Unclaim message received', message)
}
