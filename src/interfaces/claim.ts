import { IMember } from './member'

import admin from '../firebase'
import { IGuild } from './guild'

export enum CLAIM_STATUS {
  ACTIVE = "ACTIVE",
  ARCHIVED = "ARCHIVED"
}

export interface IClaimChannel {
  id: string
  name: string
}

export interface IClaim {
  createdAt: admin.firestore.Timestamp
  createdBy: IMember
  guild: IGuild
  id?: string
  party: IMember[]
  status: CLAIM_STATUS
  system: string
  updatedAt: admin.firestore.Timestamp,
  voiceChannel: IClaimChannel
}
