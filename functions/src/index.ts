import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { pinyin } from "./app/api/translator";
import * as SpeechService from "./app/api/speechservice";

admin.initializeApp();

// センテンスをコレクションに追加する
export const addMessage = functions.region("asia-northeast1").https.onRequest(
  async (req, res): Promise<void> => {
    // Grab the text parameter.
    const original = req.query.text;
    // Push the new message into the Realtime Database using the Firebase Admin SDK.
    await admin
      .firestore()
      .collection("/sentences")
      .add({ originalText: original });
    // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
    res.sendStatus(200);
  }
);

// センテンスが追加されたらピンインを取得してドキュメントにマージする
export const createUser = functions
  .region("asia-northeast1")
  .firestore.document("sentences/{sentenceId}")
  .onCreate(
    async (snap): Promise<FirebaseFirestore.WriteResult> => {
      // APIキー取得
      const key = functions.config().translator_text.key;
      const text: string = snap.get("originalText");
      const pinyinText = await pinyin(text, key);

      return snap.ref.set(
        {
          pinyin: pinyinText
        },
        { merge: true }
      );
    }
  );

// センテンスが追加されたら音声データを取得してストレージに保存する
export const onCreateSaveSpeechAudio = functions
  .region("asia-northeast1")
  .firestore.document("sentences/{sentenceId}")
  .onCreate(
    async (snap): Promise<FirebaseFirestore.WriteResult> => {
      const key = functions.config().speech_service.key;
      const text: string = snap.get("originalText");
      try {
        const token = await SpeechService.getAccessToken(key);
        const audio = await SpeechService.getAudio(text, token);
        const storage = admin.storage();
        const bucket = storage.bucket("learning-chinese-sentences-audio");
        const file = bucket.file(snap.id);
        await file.save(audio);
        const url = await file.getSignedUrl({
          action: "read",
          expires: new Date()
        });
        return snap.ref.set({ audioUrl: url }, { merge: true });
      } catch (error) {
        console.log(`Error! HTTP Status: ${error} `);
        throw new Error("error");
      }
    }
  );
