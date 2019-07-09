import * as translatorText from "./translator";
import * as config from "config";

const getKey = () => {
  const key: string = config.get("translator_text.key");
  return key;
};

test("success", () => {
  const key = getKey();
  return translatorText.pinyin("我是中国人", key).then(data => {
    expect(data).toBe("wǒ shì zhōng guó rén");
  });
});
