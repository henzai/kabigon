import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {pinyin} from "./app/api/translator";

admin.initializeApp();

//
export const createUser = functions
.region("asia-northeast1")
.firestore
.document("sentences/{sentenceId}")
.onCreate(async (snap):Promise<FirebaseFirestore.WriteResult> => {

  // APIキー取得
  const key = functions.config().translator_text.key;
  const text: string = snap.get("originalText");
  const pinyinText = await pinyin(text, key)
  
  return snap.ref.set({
      pinyin: pinyinText
  }, {merge: true});
});

//
export const addMessage = functions
.region("asia-northeast1")
.https.onRequest(async (req, res) :Promise<void> => {
  // Grab the text parameter.
  const original = req.query.text;
  // Push the new message into the Realtime Database using the Firebase Admin SDK.
  await admin.firestore().collection('/sentences').add({originalText: original});
  // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
  res.sendStatus(200);
});

