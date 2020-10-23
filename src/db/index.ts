import * as admin from 'firebase-admin'

const serviceAccount = require('../../key.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://echoes-claim-bot.firebaseio.com"
})

const db = admin.firestore()
const serverTimestamp = admin.firestore.FieldValue.serverTimestamp

export {
  admin,
  db,
  serverTimestamp
}
