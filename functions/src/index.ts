import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp();

//
export const createUser = functions
.region("asia-northeast1")
.firestore
.document("sentences/{sentenceId}")
.onCreate((snap, context):void => {

  const db = admin.firestore();

  const text: string = snap.get("originalText")


  db.collection("test").add({
    name: text,
  })
  
});

//
export const addMessage = functions
.region("asia-northeast1")
.https.onRequest(async (req, res) :Promise<void> => {
  // Grab the text parameter.
  const original = req.query.text;
  // Push the new message into the Realtime Database using the Firebase Admin SDK.
  const snapshot = await admin.firestore().collection('/sentences').add({originalText: original});
  // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
  res.status(200);
});

