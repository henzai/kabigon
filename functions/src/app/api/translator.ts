import uuidv4 = require("uuid/v4");
import * as axiosBase from "axios";

// const
const baseURL = "https://api.cognitive.microsofttranslator.com";
const transliterateURL = "/transliterate";

const getOptions = (key: string): object => {
  return {
    baseURL: baseURL,
    headers: {
      "Ocp-Apim-Subscription-Key": key,
      "Content-type": "application/json",
      "X-ClientTraceId": uuidv4().toString()
    }
  };
};

const getParams = (): object => {
  return {
    "api-version": "3.0",
    language: "zh-Hans",
    fromScript: "Hans",
    toScript: "Latn"
  };
};

// 中国語の原文からピンインを返す
export const pinyin = async (text: string, key: string): Promise<string> => {
  const body = [
    {
      text: text
    }
  ];
  const options = getOptions(key);
  const axios = axiosBase.default.create(options);
  axios.interceptors.request.use(request => {
    console.log("Starting Request: ", request);
    return request;
  });

  try {
    const res = await axios.post(transliterateURL, body, {
      params: getParams()
    });
    const pinyins = res.data;
    return pinyins[0].text;
  } catch (error) {
    console.log(`Error! HTTP Status: ${error} `);
    return "";
  }
};
