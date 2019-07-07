import { axios } from "./axios";
import * as fs from "fs";
import * as Mustache from "mustache";

const USER_AGENT =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 9_0 like Mac OS X) AppleWebKit/601.1.32 (KHTML, like Gecko) Mobile/13A4254v";

// アクセストークンを取得する
export const getAccessToken = async (key: string) => {
  try {
    const res = await axios.post("/issueToken", "", {
      baseURL: "https://westus2.api.cognitive.microsoft.com/sts/v1.0",
      headers: {
        "Ocp-Apim-Subscription-Key": key
      }
    });
    return res.data;
  } catch (error) {
    console.log(`Error! HTTP Status: ${error} `);
    throw new Error("error");
  }
};

// テキスト読み上げ用XMLを返す
export const getBody = (text: string): string => {
  const tmpl = fs.readFileSync("resources/template.mst", "utf-8");
  return Mustache.render(tmpl, { text: text });
};

// テキストを音声に変換する
export const getAudio = async (
  text: string,
  token: string
): Promise<ArrayBuffer> => {
  const body = getBody(text);
  try {
    const res = await axios.post("/cognitiveservices/v1", body, {
      baseURL: "https://westus2.tts.speech.microsoft.com",
      headers: {
        "Content-Type": "application/ssml+xml",
        "X-Microsoft-OutputFormat": "audio-16khz-32kbitrate-mono-mp3",
        "User-Agent": USER_AGENT,
        Authorization: `Bearer ${token}`
      },
      responseType: "arraybuffer"
    });
    return res.data;
  } catch (error) {
    console.log(`Error! HTTP Status: ${error} `);
    throw new Error("error");
  }
};
