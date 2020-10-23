import { Channel } from 'discord.js'

export const findParentCategory = (baseChannel: Channel): Channel => {
  return (baseChannel.type !== 'category') ? findParentCategory((baseChannel as any).parent) : baseChannel
}
