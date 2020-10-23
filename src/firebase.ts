import * as admin from 'firebase-admin'

const serviceAccount = require('../key.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://echoes-claim-bot.firebaseio.com"
})

export default admin
