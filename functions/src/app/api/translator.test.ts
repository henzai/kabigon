import * as translatorText from "./translator";
import * as dotenv from "dotenv";

const getKey = () => {
  dotenv.config();
  const env = process.env;
  const key = env.TRANSLATOR_KEY;
  console.log(key);
  if (key == undefined) {
    throw new Error("TRANSLATOR_KEY is not set");
  }
  return key;
};

test("success", () => {
  const key = getKey();
  return translatorText.pinyin("我是中国人", key).then(data => {
    expect(data).toBe("wǒ shì zhōng guó rén");
  });
});
