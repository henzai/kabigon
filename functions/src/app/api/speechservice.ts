import { axios } from "./axios";
import * as fs from "fs";

const USER_AGENT =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 9_0 like Mac OS X) AppleWebKit/601.1.32 (KHTML, like Gecko) Mobile/13A4254v";

// アクセストークンを取得する
export const getAccessToken = async (key: string) => {
  axios.interceptors.request.use(request => {
    console.log("Starting Request: ", request);
    return request;
  });
  try {
    const res = await axios.post("/issueToken", "", {
      baseURL: "https://westus2.api.cognitive.microsoft.com/sts/v1.0",
      headers: {
        "Ocp-Apim-Subscription-Key": key
      }
    });
    const token = res.data;
    return token;
  } catch (error) {
    console.log(`Error! HTTP Status: ${error} `);
    return "";
  }
};

// テキストを音声に変換する
export const getAudio = async (token: string): Promise<ArrayBuffer> => {
  const body = fs.readFileSync("resources/template.xml", "utf-8");
  console.log(body);

  axios.interceptors.request.use(request => {
    console.log("Starting Request: ", request);
    return request;
  });
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
