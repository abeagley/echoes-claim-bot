import { claim } from './claim'
import { setup } from './setup'
import { unclaim } from './unclaim'

import { COMMANDS } from '../constants'

// Manual for now, can move to dynamic if needed in the future
const commands: { [name: string]: any } = {
  [COMMANDS.CLAIM]: claim,
  [COMMANDS.SETUP]: setup,
  [COMMANDS.UNCLAIM]: unclaim
}

export default commands
