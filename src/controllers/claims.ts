import { db } from '../db'
import { CLAIM_STATUS, IClaim } from '../interfaces/claim'
import { IMember } from '../interfaces/member'

export const createClaim = async (claimToCreate: IClaim): Promise<string | null> => {
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

export const findClaim = async (guildId: string, system: string): Promise<IClaim | null> => {
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

export const releaseClaim = async (guildId: string, system: string, unclaimedBy?: IMember): Promise<void> => {
  let claim: IClaim | null = null
  try {
    claim = await findClaim(guildId, system)
  } catch (e) {
    console.error(e)
    throw e
  }

  if (!claim || !claim.id) {
    throw new Error('No claim to update')
  }

  try {
    await db.collection('claims')
      .doc(claim.id)
      .update({
        status: CLAIM_STATUS.ARCHIVED,
        unclaimedBy: (unclaimedBy) ? unclaimedBy : { id: 'BOT', name: 'EchoesClaimBot' }
      })
  } catch (e) {
    console.error(e)
    throw e
  }
}
